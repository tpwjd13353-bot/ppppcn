// 동적 제안서 데이터 모델 — LLM 출력 / 화면 편집 / PDF 렌더가 같은 스키마 공유.

export interface ProposalData {
  // 표지
  cover: {
    title: string;        // 메인 타이틀 (멀티라인 가능 — \n 포함)
    forLine: string;      // "FOR. 마산게낙찜..."
    subline: string;      // 클라이언트·발행일·대행사 한 줄
  };

  // 1. 현황 진단
  diagnosis: {
    strength: string;     // 강점 박스 본문 (멀티라인)
    current: string;      // 현 상태 본문
    pain: string;         // 핵심 통증 본문
    competitor: string;   // 경쟁사 한계 본문
    conclusionHeadline: string;
    conclusionBody: string;
    whyChannel: Array<{ big: string; label: string; note: string }>;
  };

  // 2. 단계 전략 (표)
  phaseStrategy: {
    phase1Goal: string;
    phase1Channel: string;
    phase2Goal: string;
    phase2Channel: string;
    principle: string;
  };

  // 3. Phase 1 상세
  phase1: {
    dianpingBullets: string[];
    kocBullets: string[];
    kpiBullets: string[];           // 마지막 항목은 accent(빨강)로 자동 표시
    timeline: Array<{ month: string; title: string; body: string }>;
  };

  // 4. Phase 2
  phase2: {
    intro: string;
    bullets: string[];
    kpiBullets: string[];
  };

  // 5. 콘텐츠 방향성
  content: {
    intro: string;
    axes: Array<{ pct: string; label: string; body: string }>; // 4개 권장
    commonGuide: string[];
    compareLeftLabel: string;
    compareLeft: string[];
    compareRightLabel: string;
    compareRight: string[];
  };

  // 6. 예산 (표)
  budget: {
    rows: Array<{ label: string; sub: string; unit: string; amount: string }>;
    note: string;
  };

  // 7. 기대 효과
  expectation: {
    canExpect: string;
    premise: string;
  };

  // 메타 (PDF 푸터·표지 일자에 사용)
  meta: {
    clientName: string;     // 푸터 좌측 텍스트에 들어감
    issuedAtIso: string;    // ISO 문자열 (yyyy-mm-dd)
  };
}
