// Pretendard에 없는 이모지·픽토그램·비-BMP 글리프를 제거.
// PDF 렌더 시 박스(□)로 깨지는 것을 방어.

import type { ProposalData } from "./types";

// 이모지·기호 유니코드 범위 (Extended_Pictographic + Misc Symbols + 보조 평면)
// \p{Extended_Pictographic} 가 가장 폭넓게 잡힘. ZWJ·VS16 같은 결합문자도 함께 제거.
const STRIP_RE =
  /[\p{Extended_Pictographic}‍️☀-➿\u{1F000}-\u{1FFFF}]/gu;

function cleanText(s: string | undefined | null): string {
  if (!s) return "";
  // 이모지 제거 후 앞뒤 공백·중복 공백 정리
  return s.replace(STRIP_RE, "").replace(/[ \t]{2,}/g, " ").trim();
}

function cleanArr(arr: string[] | undefined): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(cleanText).filter((s) => s.length > 0);
}

export function sanitizeProposal(data: ProposalData): ProposalData {
  return {
    cover: {
      title: cleanText(data.cover.title),
      forLine: cleanText(data.cover.forLine),
      subline: cleanText(data.cover.subline),
    },
    diagnosis: {
      strength: cleanText(data.diagnosis.strength),
      current: cleanText(data.diagnosis.current),
      pain: cleanText(data.diagnosis.pain),
      competitor: cleanText(data.diagnosis.competitor),
      conclusionHeadline: cleanText(data.diagnosis.conclusionHeadline),
      conclusionBody: cleanText(data.diagnosis.conclusionBody),
      whyChannel: (data.diagnosis.whyChannel ?? []).map((c) => ({
        big: cleanText(c.big),
        label: cleanText(c.label),
        note: cleanText(c.note),
      })),
    },
    phaseStrategy: {
      phase1Goal: cleanText(data.phaseStrategy.phase1Goal),
      phase1Channel: cleanText(data.phaseStrategy.phase1Channel),
      phase2Goal: cleanText(data.phaseStrategy.phase2Goal),
      phase2Channel: cleanText(data.phaseStrategy.phase2Channel),
      principle: cleanText(data.phaseStrategy.principle),
    },
    phase1: {
      dianpingBullets: cleanArr(data.phase1.dianpingBullets),
      kocBullets: cleanArr(data.phase1.kocBullets),
      kpiBullets: cleanArr(data.phase1.kpiBullets),
      timeline: (data.phase1.timeline ?? []).map((t) => ({
        month: cleanText(t.month),
        title: cleanText(t.title),
        body: cleanText(t.body),
      })),
    },
    phase2: {
      intro: cleanText(data.phase2.intro),
      bullets: cleanArr(data.phase2.bullets),
      kpiBullets: cleanArr(data.phase2.kpiBullets),
    },
    content: {
      intro: cleanText(data.content.intro),
      axes: (data.content.axes ?? []).map((a) => ({
        pct: cleanText(a.pct),
        label: cleanText(a.label),
        body: cleanText(a.body),
      })),
      commonGuide: cleanArr(data.content.commonGuide),
      compareLeftLabel: cleanText(data.content.compareLeftLabel),
      compareLeft: cleanArr(data.content.compareLeft),
      compareRightLabel: cleanText(data.content.compareRightLabel),
      compareRight: cleanArr(data.content.compareRight),
    },
    budget: {
      rows: (data.budget.rows ?? []).map((r) => ({
        label: cleanText(r.label),
        sub: cleanText(r.sub),
        unit: cleanText(r.unit),
        amount: cleanText(r.amount),
      })),
      note: cleanText(data.budget.note),
    },
    expectation: {
      canExpect: cleanText(data.expectation.canExpect),
      premise: cleanText(data.expectation.premise),
    },
    meta: {
      clientName: cleanText(data.meta.clientName),
      issuedAtIso: cleanText(data.meta.issuedAtIso),
    },
  };
}
