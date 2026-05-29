export type MediaType = "video" | "image" | "gradient";

export type ShowcaseCard = {
  id: string;
  platform: string;
  title: string;
  author: string;
  likes: string;
  mediaType: MediaType;
  mediaUrl: string;
  gradient: string;
  linkUrl?: string; // 있으면 카드 클릭 시 새 창으로 이동 (샤오홍슈/틱톡 게시물 등)
};

export type ShowcaseData = {
  cards: ShowcaseCard[];
};

// 색상환(hue) 순서로 배열 — 카드가 흐를 때 무지개처럼 부드럽게 색이 전환됩니다.
export const GRADIENT_PRESETS = [
  "from-rose-500/50 to-pink-400/40",
  "from-red-500/50 to-orange-400/40",
  "from-orange-500/50 to-amber-400/40",
  "from-amber-500/50 to-yellow-400/40",
  "from-lime-500/50 to-emerald-400/40",
  "from-emerald-500/50 to-teal-400/40",
  "from-teal-500/50 to-cyan-400/40",
  "from-sky-500/50 to-blue-400/40",
  "from-blue-500/50 to-indigo-400/40",
  "from-indigo-500/50 to-violet-400/40",
  "from-violet-500/50 to-fuchsia-400/40",
  "from-fuchsia-500/50 to-pink-400/40",
];

export const PLATFORM_OPTIONS = ["샤오홍슈", "따종디엔핑", "고덕지도"];

// 붙여넣기 실수로 같은 URL이 두 번 이어붙은 경우 첫 번째 URL만 남깁니다.
export function cleanUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  const secondHttp = trimmed.indexOf("http", 1);
  return secondHttp > 0 ? trimmed.slice(0, secondHttp) : trimmed;
}
