// 메뉴 점수
//
// 매칭 방식: 정확 일치 → 부분 일치 (포함 관계)
// 점수 = (매칭된 점수 합 + 미매칭 * 50) / 전체 개수
// 매칭 실패 메뉴는 50점(중립)으로 평균에 포함

import { getScoreData } from "@/lib/analyze/scoreData";
import type { MenuMatch, MenuScore } from "@/lib/types/scoring";

const NEUTRAL_SCORE = 50;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\s\-_·,.()\[\]'"`~!@#$%^&*=+:;?/\\|]+/g, "")
    .trim();
}

export function getMenuScore(menus: string[]): MenuScore {
  const data = getScoreData();

  // 긴 메뉴명부터 매칭 (구체적인 매칭 우선)
  const sorted = [...data.menus].sort(
    (a, b) => b.name.length - a.name.length,
  );

  const matches: MenuMatch[] = (menus ?? []).map((input) => {
    const raw = (input ?? "").trim();
    if (!raw) return { input: raw, matched: false };

    const inputNorm = normalize(raw);
    if (!inputNorm) return { input: raw, matched: false };

    // 1) 정확 일치
    for (const m of sorted) {
      if (normalize(m.name) === inputNorm) {
        return {
          input: raw,
          matched: true,
          menuName: m.name,
          score: m.score,
          단계: m.tier,
          분류: m.category,
        };
      }
    }

    // 2) 부분 일치 (포함 관계)
    for (const m of sorted) {
      const mn = normalize(m.name);
      if (mn.length < 2) continue; // 한 글자 오매칭 방지
      if (inputNorm.includes(mn) || mn.includes(inputNorm)) {
        return {
          input: raw,
          matched: true,
          menuName: m.name,
          score: m.score,
          단계: m.tier,
          분류: m.category,
        };
      }
    }

    return { input: raw, matched: false };
  });

  const matchedCount = matches.filter((m) => m.matched).length;
  const unmatchedCount = matches.length - matchedCount;

  // 점수 평균 — 미매칭은 50점으로 계산에 포함
  let score: number;
  if (matches.length === 0) {
    score = NEUTRAL_SCORE;
  } else {
    const sumMatched = matches.reduce((s, m) => s + (m.score ?? 0), 0);
    const sumUnmatched = unmatchedCount * NEUTRAL_SCORE;
    score = Math.round((sumMatched + sumUnmatched) / matches.length);
  }

  // 상담 유도: 미매칭 >= 매칭 시
  let needsConsultation = false;
  let consultationReason: string | undefined;

  if (matches.length > 0 && unmatchedCount >= matchedCount) {
    needsConsultation = true;
    if (unmatchedCount === matches.length) {
      consultationReason =
        "입력하신 메뉴가 일반 DB에 없는 특수 메뉴입니다. 전문가 분석을 권장드립니다";
    } else {
      consultationReason = `${unmatchedCount}개 메뉴는 별도 분석이 필요합니다`;
    }
  }

  return {
    score,
    matches,
    matchedCount,
    unmatchedCount,
    needsConsultation,
    consultationReason,
  };
}
