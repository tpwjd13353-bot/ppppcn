import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

// A4 정확 크기 (595x842 pt 매칭, 화질 위해 2배 = 1190x1684 px)
const src = path.join(process.cwd(), "public/images/page1-bg-source.jpg");
const dst = path.join(process.cwd(), "public/images/page1-bg.jpg");

// 원본 백업이 없으면 현재 dst를 src로 (재실행 가능하게)
try {
  await fs.access(src);
} catch {
  await fs.copyFile(dst, src);
}

const buf = await sharp(src)
  .resize(595, 842, { fit: "cover", position: "center" }) // A4 정확 픽셀=포인트
  .grayscale()
  .jpeg({ quality: 82 })
  .toBuffer();

await fs.writeFile(dst, buf);
console.log("✅ resized to 595x842:", (buf.length / 1024).toFixed(1) + "KB");
