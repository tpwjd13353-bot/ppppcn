import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const src = path.join(process.cwd(), "public/images/page1-bg-source.jpg");
const dst = path.join(process.cwd(), "public/images/page1-bg.jpg");

try {
  await fs.access(src);
} catch {
  await fs.copyFile(dst, src);
}

const buf = await sharp(src)
  .resize(595, 842, { fit: "cover", position: "center" })
  .grayscale()
  .jpeg({ quality: 82 })
  .toBuffer();

await fs.writeFile(dst, buf);
console.log("✅ resized to 595x842:", (buf.length / 1024).toFixed(1) + "KB");
