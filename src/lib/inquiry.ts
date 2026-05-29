export type Inquiry = {
  id: string;
  createdAt: string;
  business: string; // 상호명 (필수)
  contact: string; // 연락처 (필수)
  industry?: string;
  region?: string;
  budget?: string;
  message?: string;
};

export type InquiryData = { inquiries: Inquiry[] };

export const INDUSTRY_OPTIONS = ["외식", "뷰티", "레저", "숙박·호텔", "기타"];

export const BUDGET_OPTIONS = [
  "미정 / 상담 후 결정",
  "월 100만원 이하",
  "월 100~300만원",
  "월 300~500만원",
  "월 500만원 이상",
];
