import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const srcPng = path.join(root, "public/images/page1-bg-source.png");
const srcJpg = path.join(root, "public/images/page1-bg-source.jpg");
const dst = path.join(root, "public/images/page1-bg.jpg");

// 우선 PNG 있으면 사용, 없으면 JPG
let src;
try {
  await fs.access(srcPng);
  src = srcPng;
} catch {
  src = srcJpg;
}

// A4 비율 흑백 X, 컬러 톤 다운으로 콘텐츠 가독성 확보
const buf = await sharp(src)
  .resize(595, 842, { fit: "cover", position: "center" })
  .modulate({ saturation: 0.55, brightness: 1.05 }) // 톤 60% + 약간 밝게
  .blur(0.3) // 살짝 흐릿하게 (디테일 약화)
  .jpeg({ quality: 80 })
  .toBuffer();

await fs.writeFile(dst, buf);
console.log("✅ 처리됨 595x842:", (buf.length / 1024).toFixed(1) + "KB");
