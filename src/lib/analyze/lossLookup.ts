import { estimateLoss, type LossEstimate } from "./lossEstimate";
import type { NaverPlaceData } from "./naver";
import type { AnalysisResult } from "@/lib/types/scoring";

const PRICE_PER_VISIT_KRW = 60_000;

const SIDOS_FULL = [
  "서울특별시",
  "부산광역시",
  "인천광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "강원도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

function getMarketShareRange(nationalRank: number): [number, number] {
  if (nationalRank <= 10) return [0.005, 0.02];
  if (nationalRank <= 25) return [0.01, 0.03];
  return [0.02, 0.05];
}

/** 주소에서 시군구 이름 패턴 추출 — 단순 정규식.
 *  예: "경기 안산시 단원구..." → "안산시 단원구"
 *      "서울 광진구..." → "광진구"
 *      "충북 청주시 흥덕구..." → "청주시 흥덕구"
 *  실패 시 null. */
function extractSigunguFromAddress(addr: string): string | null {
  // 시+구 패턴 (예: 안산시 단원구)
  const m1 = addr.match(/([가-힣]+시)\s+([가-힣]+구)/);
  if (m1) return `${m1[1]} ${m1[2]}`;
  // 단일 구·시·군
  const m2 = addr.match(/([가-힣]+(?:구|군))(?=[\s,])/);
  if (m2) return m2[1];
  const m3 = addr.match(/([가-힣]+시)(?=[\s,])/);
  if (m3) return m3[1];
  return null;
}

/** 시도 인덱스 (csv sido와 추출된 sido_full 매칭용) */
function shortenSido(sido: string): string {
  return sido.replace(/(특별자치도|특별자치시|특별시|광역시|도)$/g, "");
}

export async function lookupLossFromReport(report: {
  place: NaverPlaceData;
  result: AnalysisResult;
}): Promise<LossEstimate | null> {
  const { region } = report.result.details;
  const tier = region.match.tier;

  const { getScoreData } = await import("./scoreData");
  const data = getScoreData();

  const addr = `${report.place.address ?? ""} ${report.place.roadAddress ?? ""}`;
  if (!addr.trim()) return null;

  // 1순위: 시군구 정밀 매칭 (csv 48개)
  for (const stat of data.regionStats) {
    if (addr.includes(stat.sigungu) && addr.includes(stat.sido.slice(0, 2))) {
      return estimateLoss(stat.sido, stat.sigungu);
    }
  }

  // 2순위: 상권 → 시군구 변환
  if (tier === "상권" && region.match.matchedName) {
    const sg = data.sanggwons.find((s) => s.name === region.match.matchedName);
    if (sg) return estimateLoss(sg.sido, sg.sigungu);
  }

  // 3순위: 시도 fallback — 같은 시도 시군구들 평균
  for (const sidoFull of SIDOS_FULL) {
    const short = shortenSido(sidoFull);
    if (short.length >= 2 && addr.includes(short.slice(0, 2))) {
      const sameSido = data.regionStats.filter(
        (s) => shortenSido(s.sido).slice(0, 2) === short.slice(0, 2),
      );
      if (sameSido.length > 0) {
        const avgAnnual = Math.round(
          sameSido.reduce((sum, s) => sum + s.annualChineseVisitors, 0) /
            sameSido.length,
        );
        const avgRank = Math.round(
          sameSido.reduce((sum, s) => sum + s.nationalRank, 0) /
            sameSido.length,
        );
        const [shareLow, shareHigh] = getMarketShareRange(avgRank);
        const sigunguName =
          extractSigunguFromAddress(addr) || `${short} 권역`;
        return {
          sido: sidoFull,
          sigungu: sigunguName,
          monthlyChineseVisitors: Math.round(avgAnnual / 12),
          annualChineseVisitors: avgAnnual,
          annualLossKRWLow: Math.round(avgAnnual * PRICE_PER_VISIT_KRW * shareLow),
          annualLossKRWHigh: Math.round(
            avgAnnual * PRICE_PER_VISIT_KRW * shareHigh,
          ),
          nationalRank: avgRank,
          cardSpendShareInSido: 0,
          marketSharePctLow: shareLow * 100,
          marketSharePctHigh: shareHigh * 100,
          pricePerVisitKRW: PRICE_PER_VISIT_KRW,
          note: `${short} 평균 기반 추정`,
        };
      }
    }
  }

  // 4순위: 전국 평균 fallback
  const allStats = data.regionStats;
  if (allStats.length > 0) {
    const avgAnnual = Math.round(
      allStats.reduce((sum, s) => sum + s.annualChineseVisitors, 0) /
        allStats.length,
    );
    const avgRank = Math.round(
      allStats.reduce((sum, s) => sum + s.nationalRank, 0) / allStats.length,
    );
    const [shareLow, shareHigh] = getMarketShareRange(avgRank);
    const sigunguName = extractSigunguFromAddress(addr) || "매장 권역";
    return {
      sido: "대한민국",
      sigungu: sigunguName,
      monthlyChineseVisitors: Math.round(avgAnnual / 12),
      annualChineseVisitors: avgAnnual,
      annualLossKRWLow: Math.round(avgAnnual * PRICE_PER_VISIT_KRW * shareLow),
      annualLossKRWHigh: Math.round(
        avgAnnual * PRICE_PER_VISIT_KRW * shareHigh,
      ),
      nationalRank: avgRank,
      cardSpendShareInSido: 0,
      marketSharePctLow: shareLow * 100,
      marketSharePctHigh: shareHigh * 100,
      pricePerVisitKRW: PRICE_PER_VISIT_KRW,
      note: "전국 평균 기반 추정",
    };
  }

  return null;
}
