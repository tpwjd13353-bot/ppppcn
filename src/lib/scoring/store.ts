// 상권 종합 점수
// - 지역, 메뉴 둘 다 있으면 평균
// - 메뉴가 null (전부 미매칭) 이면 지역 점수만 사용

import type {
  RegionScore,
  MenuScore,
  StoreScore,
} from "@/lib/types/scoring";
import { getGrade } from "./grade";

export function getStoreScore(
  region: RegionScore,
  menu: MenuScore,
): StoreScore {
  const score =
    menu.score === null
      ? region.score
      : Math.round((region.score + menu.score) / 2);
  return {
    score,
    grade: getGrade(score),
    label: "상권 분석",
  };
}
