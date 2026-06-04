// 미매칭 메뉴(=DB에 없는 메뉴) 중 음료·디저트류 자동 추출.
// platform_playbook desc_template의 {{viral_menus}} 자리에 치환할 텍스트도 함께 반환.

import type { MenuMatch } from "@/lib/types/scoring";

// 음료·디저트 키워드 (느슨한 매칭). 추후 어드민에서 편집 가능.
const VIRAL_KEYWORDS = [
  "하입볼",
  "스무디",
  "에이드",
  "주스",
  "라떼",
  "커피",
  "티",
  "차",
  "쉐이크",
  "음료",
  "쥬스",
  "콜라",
  "사이다",
  "디저트",
  "케이크",
  "마카롱",
  "도넛",
  "와플",
  "크로플",
  "푸딩",
  "젤리",
  "아이스",
  "에스프레소",
  "콜드브루",
  "프라페",
  "휘핑",
  "코코아",
  "초코",
  "바닐라",
  "딸기",
  "망고",
  "복숭아",
  "피치",
  "자몽",
  "레몬",
  "오렌지",
  "블루베리",
  "포도",
  "키위",
  "요거트",
  "젤라또",
  "젤라토",
  "빙수",
  "팥빙수",
  "셔벗",
  "소다",
  "탄산",
];

export interface ViralExtract {
  count: number;
  names: string[]; // 미매칭 + 키워드 매칭된 메뉴명
  injection: string; // {{viral_menus}} 자리 치환용 — 예: "피치·자몽·블루베리 하입볼"
}

export function extractViralMenus(matches: MenuMatch[]): ViralExtract {
  const unmatched = matches.filter((m) => !m.matched);
  const names = unmatched
    .map((m) => m.input)
    .filter((name) => {
      const n = name.toLowerCase();
      return VIRAL_KEYWORDS.some((k) => n.includes(k.toLowerCase()));
    });

  // injection 텍스트: 상위 3~4개를 짧게 (예: 메인 명사 추출 후 "·" 구분)
  // 단순화: 상위 3개 메뉴 이름 그대로 합치되 너무 길면 자르기
  const top = names.slice(0, 3);
  let injection = top.join(" · ");
  if (!injection) injection = "비주얼이 강한 음료·디저트";
  if (injection.length > 40) injection = injection.slice(0, 38) + "…";

  return {
    count: names.length,
    names,
    injection,
  };
}

/** desc_template의 {{viral_menus}} 자리 치환 */
export function applyViralTemplate(template: string, viral: ViralExtract): string {
  return template.replace(/\{\{viral_menus\}\}/g, viral.injection);
}
