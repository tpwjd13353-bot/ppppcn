// ============================================
// 점수 시스템 타입 정의
// ============================================

export type RegionTier = "상권" | "시군구" | "시도" | "폴백";

export interface MatchInfo {
  matched: boolean;
  tier?: RegionTier;
  matchedName?: string;
  비고?: string;
}

export interface RegionScore {
  score: number;
  match: MatchInfo;
  needsConsultation: boolean;
  consultationReason?: string;
}

export interface MenuMatch {
  input: string;
  matched: boolean;
  menuName?: string;
  score?: number;
  단계?: number;
  분류?: string;
}

export interface MenuScore {
  /** 매칭된 메뉴의 평균. 모두 미매칭이면 null. */
  score: number | null;
  matches: MenuMatch[];
  matchedCount: number;
  unmatchedCount: number;
  needsConsultation: boolean;
  consultationReason?: string;
}

export interface MarketingScore {
  score: number;
  grade: string;
  message: string;
}

export interface StoreScore {
  score: number;
  grade: string;
  label: string;
}

export type ConsultationPriority = "high" | "medium" | "low";

export interface ConsultationInfo {
  recommended: boolean;
  reasons: string[];
  priority: ConsultationPriority;
}

export interface AnalysisResult {
  store: StoreScore;
  marketing: MarketingScore;
  details: {
    region: RegionScore;
    menu: MenuScore;
  };
  conclusion: string;
  consultation: ConsultationInfo;
}
