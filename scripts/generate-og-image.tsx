// OG 이미지 생성 — gpt-image-2로 프리미엄 배경 생성 → public/og-image.png
// 실행: npx tsx --tsconfig tsconfig.json scripts/generate-og-image.tsx

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

const PROMPT = `
A premium cinematic Open Graph banner background for a Korean marketing agency
targeting Chinese tourists. Wide format (1.91:1).

Visual: Sophisticated night view of Seoul Myeongdong/Gangnam district with
soft glowing Korean and Chinese neon signs (subtle, not loud), warm bokeh lights,
shoppers walking along illuminated storefronts. Modern, premium, editorial.

Color palette: Deep navy blue (#0F2845) base, with warm golden amber accents
from city lights, soft purple-magenta highlights from neon. Cinematic color grading.

Style: High-end advertising photography. Shallow depth of field. Premium luxury
brand magazine aesthetic. Slightly desaturated, moody but inviting.

Important:
- No text, no logos, no signs that look like brand names
- Leave clean empty area in the upper-left and center for typography overlay
- The background should feel like the cover of a premium business magazine
- Composition: vignette on edges, focal warmth in center
`;

async function main() {
  console.log("→ gpt-image-2 호출 중 (1536x1024)...");
  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt: PROMPT.trim(),
    size: "1536x1024",
    n: 1,
  });

  const b64 = res.data?.[0]?.b64_json;
  if (!b64) {
    console.error("이미지 데이터를 받지 못했습니다.");
    process.exit(1);
  }
  const raw = Buffer.from(b64, "base64");

  // 1200x630으로 크롭 + 살짝 어둡게 (텍스트 가독성 위해)
  console.log("→ sharp로 1200x630 크롭 + 톤 조정 중...");
  const processed = await sharp(raw)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.92, saturation: 0.95 })
    .png({ quality: 92 })
    .toBuffer();

  // 배경 저장 (텍스트 없는 raw 배경 — 백업용)
  const bgPath = path.resolve("public", "og-bg.png");
  fs.writeFileSync(bgPath, processed);
  console.log(`✓ background saved: ${bgPath}`);

  // 텍스트 오버레이 합성
  console.log("→ 텍스트 오버레이 합성 중...");

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topShade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0.55)"/>
      <stop offset="40%" stop-color="rgba(0,0,0,0.25)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
    <linearGradient id="bottomShade" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="rgba(0,0,0,0.65)"/>
      <stop offset="50%" stop-color="rgba(0,0,0,0.15)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </linearGradient>
  </defs>

  <!-- 가독성용 그라데이션 셰이드 -->
  <rect width="1200" height="220" fill="url(#topShade)"/>
  <rect y="380" width="1200" height="250" fill="url(#bottomShade)"/>

  <!-- 좌상단 브랜드 -->
  <text x="64" y="92"
        font-family="'Malgun Gothic', 'Noto Sans KR', sans-serif"
        font-size="28" font-weight="900" letter-spacing="4"
        fill="#FFFFFF">PURPLEPEPPER</text>

  <!-- 우상단 MEITUAN 뱃지 -->
  <g transform="translate(940,58)">
    <rect width="200" height="44" rx="22" ry="22"
          fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.8"/>
    <text x="100" y="29"
          font-family="'Malgun Gothic', sans-serif"
          font-size="13" font-weight="700" letter-spacing="2"
          text-anchor="middle"
          fill="#FFFFFF">★ MEITUAN OFFICIAL</text>
  </g>

  <!-- 메인 카피 (한글) -->
  <text x="64" y="380"
        font-family="'Malgun Gothic', 'Noto Sans KR', sans-serif"
        font-size="78" font-weight="900" letter-spacing="-2"
        fill="#FFFFFF">중국 관광객, 우리 가게로.</text>

  <!-- 서브 카피 채널 -->
  <text x="64" y="438"
        font-family="'Malgun Gothic', 'Noto Sans KR', sans-serif"
        font-size="26" font-weight="500" letter-spacing="0.5"
        fill="rgba(255,255,255,0.85)">따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보</text>

  <!-- 서브 카피 설명 -->
  <text x="64" y="478"
        font-family="'Malgun Gothic', 'Noto Sans KR', sans-serif"
        font-size="22" font-weight="400" letter-spacing="0.3"
        fill="rgba(255,255,255,0.7)">방한 중국 관광객 매장 전환 · 메이투안 본사 정식 인증 대행사</text>

  <!-- 하단 좌측: 도메인 -->
  <text x="64" y="585"
        font-family="'Malgun Gothic', sans-serif"
        font-size="22" font-weight="700" letter-spacing="2"
        fill="rgba(255,255,255,0.85)">ppppcn.com</text>

  <!-- 하단 우측: 카피 -->
  <text x="1136" y="585" text-anchor="end"
        font-family="'Malgun Gothic', 'Noto Sans KR', sans-serif"
        font-size="20" font-weight="500"
        fill="rgba(255,255,255,0.7)">중국 마케팅 전문 대행사</text>
</svg>`;

  const finalImage = await sharp(processed)
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .png({ quality: 92 })
    .toBuffer();

  // src/app/opengraph-image.png — Next.js metadata 파일 컨벤션
  const ogPath = path.resolve("src", "app", "opengraph-image.png");
  fs.writeFileSync(ogPath, finalImage);
  console.log(`✓ final OG image saved: ${ogPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
