import { estimateLoss, type LossEstimate } from "./lossEstimate";
import type { NaverPlaceData } from "./naver";
import type { AnalysisResult } from "@/lib/types/scoring";

export async function lookupLossFromReport(report: {
  place: NaverPlaceData;
  result: AnalysisResult;
}): Promise<LossEstimate | null> {
  const { region } = report.result.details;
  const tier = region.match.tier;

  const { getScoreData } = await import("./scoreData");
  const data = getScoreData();

  const addr = `${report.place.address ?? ""} ${report.place.roadAddress ?? ""}`;
  for (const stat of data.regionStats) {
    if (addr.includes(stat.sigungu) && addr.includes(stat.sido.slice(0, 2))) {
      return estimateLoss(stat.sido, stat.sigungu);
    }
  }

  if (tier === "상권" && region.match.matchedName) {
    const sg = data.sanggwons.find((s) => s.name === region.match.matchedName);
    if (sg) return estimateLoss(sg.sido, sg.sigungu);
  }

  return null;
}
