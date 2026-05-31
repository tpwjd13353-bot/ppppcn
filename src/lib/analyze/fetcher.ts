// 네이버 페이지 fetcher (Bright Data 프록시 선택적 사용)
//
// BRIGHT_DATA_PROXY 환경변수가 있으면 그 프록시로 요청.
// 없으면 직접 fetch (로컬 테스트는 됨, Railway 등 서버에선 차단 가능).
//
// wolcheon-system 의 동작 방식을 따르되 자격증명은 코드에 두지 않습니다.

import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

// 프록시 환경에서 TLS 인증서 이슈 무시
if (process.env.BRIGHT_DATA_PROXY) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const PROXY_URL = process.env.BRIGHT_DATA_PROXY;

/** 새 세션 ID (Bright Data sticky session 회전용) */
function newSessionId(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}

/** 같은 sessionId면 같은 IP 재사용 (TLS 핸드셰이크 절약) */
const agentCache = new Map<string, HttpsProxyAgent<string>>();
function getAgent(sessionId: string): HttpsProxyAgent<string> | null {
  if (!PROXY_URL) return null;
  let agent = agentCache.get(sessionId);
  if (!agent) {
    const url = PROXY_URL.replace(
      /(-zone-[^:]+)(:)/,
      `$1-session-${sessionId}$2`,
    );
    agent = new HttpsProxyAgent(url, {
      keepAlive: true,
      keepAliveMsecs: 60000,
    });
    agentCache.set(sessionId, agent);
  }
  return agent;
}

export interface FetchResult {
  status: number;
  data: string;
  via: "proxy" | "direct";
}

export async function fetchHtml(
  url: string,
  options: {
    timeout?: number;
    headers?: Record<string, string>;
    sessionId?: string;
  } = {},
): Promise<FetchResult> {
  const sessionId = options.sessionId ?? newSessionId();
  const agent = getAgent(sessionId);

  const res = await axios.get(url, {
    httpsAgent: agent ?? undefined,
    timeout: options.timeout ?? 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      Referer: "https://m.search.naver.com/",
      Origin: "https://m.search.naver.com",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Connection: "keep-alive",
      ...options.headers,
    },
    responseType: "text",
    validateStatus: () => true,
  });

  return {
    status: res.status,
    data:
      typeof res.data === "string" ? res.data : JSON.stringify(res.data),
    via: agent ? "proxy" : "direct",
  };
}

/** 모든 캐시된 프록시 세션 강제 정리 (다음 요청은 새 IP) */
export function rotateProxySessions(): void {
  for (const [, agent] of agentCache) {
    try {
      (agent as unknown as { destroy?: () => void }).destroy?.();
    } catch {
      /* ignore */
    }
  }
  agentCache.clear();
}

export const isProxyConfigured = (): boolean => !!PROXY_URL;
