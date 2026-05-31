// 지역 점수 — 주소(지번·도로명)로 상권/시군구/시도 단계별 매칭
//
// 매칭 우선순위:
//   1) 상권 (도로명 키워드 → 동 키워드 → 보조 키워드)
//   2) 시군구
//   3) 시도
//   4) 폴백 (30점)

import { getScoreData } from "@/lib/analyze/scoreData";
import type { SanggwonItem } from "@/lib/analyze/scoreData";
import type { RegionScore } from "@/lib/types/scoring";

const FALLBACK_SCORE = 30;

function sidoAliases(name: string): string[] {
  const out = [name];
  const trimmed = name
    .replace(/특별자치도$/, "")
    .replace(/특별자치시$/, "")
    .replace(/특별시$/, "")
    .replace(/광역시$/, "")
    .replace(/도$/, "");
  if (trimmed && trimmed !== name) out.push(trimmed);
  return out;
}

function matchByKeywords(
  candidates: SanggwonItem[],
  text: string,
  pickList: (s: SanggwonItem) => string[],
): { sanggwon: SanggwonItem; keyword: string } | null {
  for (const s of candidates) {
    const hit = pickList(s).find((kw) => kw && text.includes(kw));
    if (hit) return { sanggwon: s, keyword: hit };
  }
  return null;
}

export function getRegionScore(
  address: string,
  roadAddress: string,
): RegionScore {
  const data = getScoreData();
  const text = [address, roadAddress]
    .map((v) => (v ?? "").trim())
    .filter(Boolean)
    .join(" ");

  if (!text) {
    return {
      score: FALLBACK_SCORE,
      match: { matched: false, tier: "폴백" },
      needsConsultation: true,
      consultationReason:
        "주소가 비어있습니다. 정확한 분석을 위해 상담을 권장합니다",
    };
  }

  // 1) 시도 매칭 (긴 이름 먼저)
  const sidosSorted = [...data.sidos].sort(
    (a, b) => b.name.length - a.name.length,
  );
  const sido = sidosSorted.find((s) =>
    sidoAliases(s.name).some((a) => text.includes(a)),
  );

  if (!sido) {
    return {
      score: FALLBACK_SCORE,
      match: { matched: false, tier: "폴백" },
      needsConsultation: true,
      consultationReason:
        "주소 인식이 어렵습니다. 정확한 분석을 위해 상담을 권장합니다",
    };
  }

  // 2) 시군구 매칭 (해당 시도 내)
  const sigungu = data.sigungus.find(
    (g) => g.sido === sido.name && text.includes(g.name),
  );

  // 3) 상권 매칭 — 시도+시군구 매칭된 경우에만 시도
  if (sigungu) {
    const candidates = data.sanggwons.filter(
      (s) => s.sido === sido.name && s.sigungu === sigungu.name,
    );

    // 3-1) 도로명 키워드
    const byRoad = matchByKeywords(candidates, text, (s) => s.roadKeywords);
    if (byRoad) {
      return {
        score: byRoad.sanggwon.score,
        match: {
          matched: true,
          tier: "상권",
          matchedName: byRoad.sanggwon.name,
          비고: byRoad.sanggwon.note,
        },
        needsConsultation: false,
      };
    }

    // 3-2) 동 키워드
    const byDong = matchByKeywords(candidates, text, (s) => s.dongKeywords);
    if (byDong) {
      return {
        score: byDong.sanggwon.score,
        match: {
          matched: true,
          tier: "상권",
          matchedName: byDong.sanggwon.name,
          비고: byDong.sanggwon.note,
        },
        needsConsultation: false,
      };
    }

    // 3-3) 보조 키워드
    const byAux = matchByKeywords(candidates, text, (s) => s.auxKeywords);
    if (byAux) {
      return {
        score: byAux.sanggwon.score,
        match: {
          matched: true,
          tier: "상권",
          matchedName: byAux.sanggwon.name,
          비고: byAux.sanggwon.note,
        },
        needsConsultation: false,
      };
    }

    // 시군구 매칭됐지만 상권은 매칭 안 됨
    return {
      score: sigungu.baseScore,
      match: {
        matched: true,
        tier: "시군구",
        matchedName: sigungu.name,
        비고: sigungu.note,
      },
      needsConsultation: false,
    };
  }

  // 4) 시도만 매칭 → 상담 권장
  return {
    score: sido.baseScore,
    match: {
      matched: true,
      tier: "시도",
      matchedName: sido.name,
      비고: sido.note,
    },
    needsConsultation: true,
    consultationReason:
      "이 지역은 상세 데이터가 부족합니다. 정밀 분석을 위해 전문가 상담을 권장드립니다",
  };
}
