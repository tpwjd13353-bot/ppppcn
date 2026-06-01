// 메뉴 점수
//
// 매칭 방식: 정확 일치 → 부분 일치 (포함 관계)
// 점수 = 매칭된 메뉴의 평균. 미매칭은 평균에서 제외.
// 전부 미매칭이면 score = null (UI에서 "?"로 표시)

import { getScoreData } from "@/lib/analyze/scoreData";
import type { MenuMatch, MenuScore } from "@/lib/types/scoring";

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

  const matched = matches.filter((m) => m.matched);
  const matchedCount = matched.length;
  const unmatchedCount = matches.length - matchedCount;

  // 점수 평균 — 매칭된 것끼리만 계산. 미매칭은 평균 산정에서 제외.
  const score =
    matchedCount > 0
      ? Math.round(
          matched.reduce((s, m) => s + (m.score ?? 0), 0) / matchedCount,
        )
      : null;

  // 안내: 미매칭이 있으면 직접 입력 권장
  let needsConsultation = false;
  let consultationReason: string | undefined;

  if (matches.length > 0 && unmatchedCount > 0) {
    needsConsultation = true;
    consultationReason =
      unmatchedCount === matches.length
        ? "DB에 없는 메뉴라 분석이 어렵습니다. 정확한 메뉴명을 직접 입력해주세요."
        : `${unmatchedCount}개 메뉴는 정보가 부족해 분석이 어려워요. 직접 입력해주세요.`;
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
