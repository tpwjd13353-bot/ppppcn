// 네이버 플레이스 크롤러 — wolcheon-system 검증 방식 기반
//
// 핵심:
// - URL: https://m.place.naver.com/place/{mid}/home
// - HTML 단순 정규식 파싱 ("name":"...", "address":"...", og:title 등)
// - Bright Data 프록시 환경변수(BRIGHT_DATA_PROXY) 있으면 사용 + 실패 시 IP 회전
//
// 만일 메뉴가 0개로 잡히면 일반업종(미용실/병원 등)일 가능성. 우리는 식당만 분석 대상.

import { fetchHtml, rotateProxySessions } from "./fetcher";

export interface NaverPlaceData {
  placeId: string;
  name: string;
  address: string;
  roadAddress: string;
  category: string;
  menus: string[];
  sourceUrl: string;
  partial: boolean;
  notes: string[];
}

export class NaverParseError extends Error {
  constructor(
    message: string,
    public hint?: string,
  ) {
    super(message);
    this.name = "NaverParseError";
  }
}

// ============================================
// 1. URL → placeId 추출
// ============================================

const PLACE_ID_PATTERNS: RegExp[] = [
  // path 기반
  /\/place\/(\d+)/,
  /\/restaurant\/(\d+)/,
  /entry\/place\/(\d+)/,
  /place\.naver\.com\/(?:restaurant|place|hairshop|beautyshop|hospital|accommodation|cafe)\/(\d+)/,
  // m.map.naver.com appLink (단축링크 → m.map.naver.com 으로 풀린 케이스)
  /m\.map\.naver\.com\/appLink[^"'\s<>]*[?&](?:pinId|entryId|placeId|id)=(\d+)/,
  /m\.map\.naver\.com[^"'\s<>]*[?&](?:pinId|entryId|placeId)=(\d+)/,
  // query 기반 (마지막 — 다른 패턴이 우선)
  /[?&]pinId=(\d+)/,
  /[?&]entryId=(\d+)/,
  /[?&]placeId=(\d+)/,
  /[?&]id=(\d+)/,
];

async function resolveShortUrl(url: string): Promise<string> {
  if (!/naver\.me/.test(url)) return url;

  // 1순위: native fetch로 자동 리다이렉트 추적 → res.url
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1",
      },
    });
    clearTimeout(t);
    if (res.url && res.url !== url && /naver\.com/.test(res.url)) {
      return res.url;
    }
    // 본문에서도 한 번 더 시도 (메타 리프레시 등)
    const text = await res.text();
    const m = text.match(/https?:\/\/[^"'\s<>]*place[^"'\s<>]*\d+[^"'\s<>]*/);
    if (m) return m[0];
  } catch {
    /* fall through */
  }

  // 2순위 fallback: axios 기반 fetchHtml (프록시 환경에서 보조)
  try {
    const res = await fetchHtml(url, { timeout: 5000 });
    const m = res.data.match(/https?:\/\/[^"'\s]*place[^"'\s]*\d+[^"'\s]*/);
    if (m) return m[0];
  } catch {
    /* ignore */
  }
  return url;
}

export async function extractPlaceId(url: string): Promise<string | null> {
  const resolved = await resolveShortUrl(url.trim());
  for (const pat of PLACE_ID_PATTERNS) {
    const m = resolved.match(pat);
    if (m) return m[1];
  }
  // 원본 URL에서도 한 번 더 시도 (resolve가 못 따라간 경우)
  for (const pat of PLACE_ID_PATTERNS) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

// ============================================
// 2. HTML 파싱
// ============================================

function unescapeJsonStr(s: string): string {
  // JSON 문자열 내 \" \\ \n 등 풀기
  try {
    return JSON.parse(`"${s}"`);
  } catch {
    return s;
  }
}

interface ParsedPlace {
  name: string;
  address: string;
  roadAddress: string;
  category: string;
  menus: string[];
}

function parseHtml(html: string): ParsedPlace {
  // 상호명: og:title 우선, 없으면 JSON name
  let name = "";
  const ogTitle = html.match(/og:title[^>]+content=["']([^"']+)["']/);
  if (ogTitle) {
    name = ogTitle[1].replace(/\s*:\s*네이버.*$/, "").trim();
  }
  if (!name) {
    const nameMatch = html.match(/"name":"((?:[^"\\]|\\.)+)"/);
    if (nameMatch) name = unescapeJsonStr(nameMatch[1]);
  }

  const addrMatch = html.match(/"address":"((?:[^"\\]|\\.)+)"/);
  const address = addrMatch ? unescapeJsonStr(addrMatch[1]) : "";

  const roadAddrMatch = html.match(/"roadAddress":"((?:[^"\\]|\\.)+)"/);
  const roadAddress = roadAddrMatch ? unescapeJsonStr(roadAddrMatch[1]) : "";

  const categoryMatch = html.match(/"category":"((?:[^"\\]|\\.)+)"/);
  const category = categoryMatch ? unescapeJsonStr(categoryMatch[1]) : "";

  // 메뉴: "name":"...","price":"...","recommend":true|false 패턴
  const menus = new Set<string>();
  const menuMatches = html.matchAll(
    /"name":"((?:[^"\\]|\\.)+)","price":"((?:[^"\\]|\\.)*)","recommend":(true|false)/g,
  );
  for (const m of menuMatches) {
    const n = unescapeJsonStr(m[1]).trim();
    if (n) menus.add(n);
  }

  return { name, address, roadAddress, category, menus: [...menus] };
}

// ============================================
// 3. 메인 함수
// ============================================

const MAX_TRIES = 5;
const VALID_RESPONSE = /"name":"[^"]+"/;

export async function fetchPlaceData(url: string): Promise<NaverPlaceData> {
  const placeId = await extractPlaceId(url);
  if (!placeId) {
    throw new NaverParseError(
      "네이버 플레이스 URL에서 ID를 찾을 수 없어요.",
      "예: https://map.naver.com/p/entry/place/1234567890 또는 m.place.naver.com/place/1234567890 형식",
    );
  }

  const targetUrl = `https://m.place.naver.com/place/${placeId}/home`;
  const notes: string[] = [];
  let html = "";

  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    if (attempt > 0) {
      rotateProxySessions(); // 다음 시도는 새 IP
    }
    try {
      const res = await fetchHtml(targetUrl, { timeout: 8000 });
      if (res.status === 200 && VALID_RESPONSE.test(res.data)) {
        html = res.data;
        if (attempt > 0) {
          notes.push(`재시도 ${attempt}회 후 성공`);
        }
        break;
      }
      // 상태 코드만 기록
      if (attempt === MAX_TRIES - 1) {
        notes.push(`마지막 응답 status=${res.status}, via=${res.via}`);
      }
    } catch {
      // 다음 시도로
    }
  }

  if (!html) {
    throw new NaverParseError(
      "네이버 페이지를 가져오지 못했어요. 잠시 후 다시 시도해주세요.",
      "프록시가 미설정인 경우 Railway 서버 IP가 차단됐을 수 있습니다. BRIGHT_DATA_PROXY 환경변수를 확인하세요.",
    );
  }

  const parsed = parseHtml(html);

  if (!parsed.name) {
    throw new NaverParseError(
      "플레이스 정보를 추출하지 못했어요.",
      "네이버 페이지 구조가 변경되었을 수 있습니다.",
    );
  }

  // 메뉴 0개면 식당이 아닐 수 있음 (미용실/병원 등) — 경고
  if (parsed.menus.length === 0) {
    notes.push("메뉴 항목을 찾지 못했어요. 식당이 아닐 수 있습니다.");
  }

  return {
    placeId,
    name: parsed.name,
    address: parsed.address,
    roadAddress: parsed.roadAddress,
    category: parsed.category,
    menus: parsed.menus,
    sourceUrl: targetUrl,
    partial: !parsed.address || parsed.menus.length === 0,
    notes,
  };
}
