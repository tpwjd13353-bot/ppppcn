// 인스타 홍보 이미지 — 샤오홍슈·왕홍 체험단 선착순 이벤트
// 실행: npx tsx --tsconfig tsconfig.json scripts/generate-promo-koc.tsx
// 결과물: public/promo/koc-event-1024x1280.png

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import OpenAI from "openai";

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("OPENAI_API_KEY 환경변수를 설정해주세요.");
  process.exit(1);
}

const client = new OpenAI({ apiKey: API_KEY });

// 한글 글자가 정확히 그려지도록 quote로 명시 + 위치/색/크기 가이드 + 후킹 카피
const PROMPT = `
A high-end Korean Instagram promotional image, vertical 4:5 portrait composition. Modern, premium, eye-catching, with strong scroll-stopping hook. Magazine-cover quality.

LAYOUT (must follow exactly, top to bottom):

1. TOP RIBBON (~12% from top): a small bold red badge that says "선착순 EVENT" in clean Korean type, red background #FF2D2D, white text, slightly tilted.

2. HEADLINE BLOCK (~30% from top), white text, perfect Korean lettering, very large, bold sans-serif (Pretendard-style):
   Line 1: "샤오홍슈·왕홍 체험단"
   Line 2 (slightly smaller): "이번 한 번뿐인 테스트 가격"

3. PRICE BLOCK (center, ~55% from top), the visual hero:
   - Old price (small, gray, with clear horizontal STRIKETHROUGH line): "50,000원"
   - An arrow "→" in red
   - NEW price, massive, bold, vivid red #FF2D2D, glowing accent: "10,000원"
   - The "10,000원" text should be the largest element on the image and dominate the composition.

4. SUBHOOK (~75% from top), medium white Korean text: "80% 할인 · 선착순 10팀 마감"

5. BOTTOM CTA (~90% from top): a pill button with red background #FF2D2D, white Korean text "지금 신청하기 ▶", rounded corners.

CRITICAL TEXT REQUIREMENTS:
- All Korean characters must be rendered ACCURATELY and LEGIBLY. No garbled glyphs.
- Use a clean modern sans-serif Korean typeface (Pretendard / Apple SD Gothic Neo style).
- The Korean text I want to appear, exactly:
  "선착순 EVENT"
  "샤오홍슈·왕홍 체험단"
  "이번 한 번뿐인 테스트 가격"
  "50,000원" (with strikethrough)
  "10,000원" (huge, red, no strikethrough)
  "80% 할인 · 선착순 10팀 마감"
  "지금 신청하기"

BACKGROUND aesthetic:
- Subtle Chinese / Xiaohongshu (小红书) social commerce vibe.
- Soft pink-to-warm-white gradient base (#FFEEF1 → #FFF8F5) with subtle abstract Chinese pattern accents (faint, decorative, not literal logos).
- Floating decorative elements: soft pink hearts, blurred bokeh, subtle phone mockup silhouette showing a fake social feed (no readable text, just shapes), tiny abstract WeChat/Xiaohongshu-style speech bubbles in pink.
- Some Chinese-aesthetic floral motifs, very subtle (peony silhouettes, oriental cloud patterns) in low opacity.
- Premium soft lighting, slight grain.

COLOR PALETTE (strict):
- Background: soft warm pink #FFEEF1, cream #FFF8F5
- Primary accent: vivid red #FF2D2D (Xiaohongshu red)
- Secondary: white #FFFFFF, soft gray #888 (for strikethrough price)
- Tiny gold accents OK
- NO blue, NO green, NO purple

CRITICAL constraints:
- Output text must be exactly the Korean strings listed above. Do NOT translate, do NOT paraphrase, do NOT add extra text.
- Korean glyphs must be sharp and correctly formed.
- No watermarks, no fake logos, no Instagram UI chrome.
- No faces of real people.
- Premium professional Instagram ad aesthetic — think luxury beauty brand promo.
`;

async function main() {
  console.log("→ gpt-image-2 호출 중 (1024x1536 portrait)...");
  const res = await client.images.generate({
    // 사용자가 지정한 모델. 만약 SDK가 모델명을 모르면 OpenAI API가 에러 반환.
    model: "gpt-image-2" as never,
    prompt: PROMPT.trim(),
    size: "1024x1536",
    n: 1,
  } as never);

  const data = (res as { data?: Array<{ b64_json?: string }> }).data;
  const b64 = data?.[0]?.b64_json;
  if (!b64) {
    console.error("이미지 데이터를 받지 못했습니다.");
    process.exit(1);
  }
  const raw = Buffer.from(b64, "base64");

  // 1024x1536 → 1024x1280 (4:5 인스타 표준) 중앙 크롭
  console.log("→ sharp로 1024x1280 크롭 + 톤 보정 중...");
  const processed = await sharp(raw)
    .resize(1024, 1280, { fit: "cover", position: "center" })
    .modulate({ saturation: 1.05 })
    .png({ quality: 95 })
    .toBuffer();

  const outDir = path.resolve("public", "promo");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "koc-event-1024x1280.png");
  fs.writeFileSync(outPath, processed);
  console.log(`✓ saved: ${outPath}`);
}

main().catch((e: unknown) => {
  console.error("실패:", e);
  if (e instanceof Error) {
    console.error("메시지:", e.message);
  }
  process.exit(1);
});
