// 상권 종합 점수 = (지역 점수 + 메뉴 점수) / 2

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
  const score = Math.round((region.score + menu.score) / 2);
  return {
    score,
    grade: getGrade(score),
    label: "상권 분석",
  };
}
