// OG 이미지 배경 생성 — gpt-image-2로 블랙/레드 입체적·시네마틱 톤
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
A premium, cinematic Open Graph banner background for a Korean Chinese-inbound marketing agency. Wide format 1.91:1.

Aesthetic: High-end editorial. Think luxury automotive ad meets fashion magazine cover meets Netflix series key art.
Bold dramatic lighting. Strong negative space. Premium minimal design with strong depth.

Scene options (pick the most cinematic):
- Abstract sleek dark architectural surfaces with dynamic red light streaks slicing through
- A premium street scene at night: glossy black asphalt, dramatic red neon reflections, sleek modern Korean storefronts in deep shadow
- Abstract premium 3D forms: glass-like obsidian surfaces with crimson red light beams refracting through
- Cinematic perspective of a luxury empty street with vivid red Chinese/Korean signage glow in the distance, very moody

Color palette (strict):
- Base: pure deep black #000000 to #0a0a0b
- Accent: bold crimson red #ff2d2d, #E50914, with warm amber-red highlights
- Subtle warm orange glow for depth
- No blue, no green, no purple

Lighting:
- Dramatic side lighting with strong shadows
- Rim lighting with red glow
- Volumetric light beams in red
- High contrast cinematic mood
- Subtle film grain texture

Composition:
- Keep upper-left and lower portions of the image clean and dark (for typography overlay)
- Visual focal weight on the right and center
- Generous negative space
- Magazine cover quality composition

Critical constraints:
- NO text whatsoever
- NO logos, brand names, or readable signage
- NO people's faces (silhouettes OK)
- Photo-realistic, not illustrated
- Premium luxury aesthetic - think Apple, Tesla, Vogue, Vanity Fair
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

  // 1200x630으로 크롭 + 톤 살짝 강화
  console.log("→ sharp로 1200x630 크롭 + 톤 조정 중...");
  const processed = await sharp(raw)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .modulate({ brightness: 0.96, saturation: 1.08 })
    .png({ quality: 92 })
    .toBuffer();

  const bgPath = path.resolve("public", "og-bg.png");
  fs.writeFileSync(bgPath, processed);
  console.log(`✓ background saved: ${bgPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
