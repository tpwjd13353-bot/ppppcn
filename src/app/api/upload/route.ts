import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SAVE_DIR = path.join(process.cwd(), "public/uploads");
const FALLBACK_PASSWORD = "ddj2026";

export async function POST(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await req.formData();
    file = form.get("file") as File | null;
  } catch {
    return Response.json({ ok: false, error: "bad_request" });
  }
  if (!file) {
    return Response.json({ ok: false, error: "no_file" });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // webp 변환 + 리사이즈로 자동 최적화 (용량 1/5~1/10, 화질 거의 동일)
  let out: Buffer;
  let ext = "webp";
  try {
    out = await sharp(buf)
      .rotate() // EXIF 회전 보정
      .resize(1280, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    // 이미지가 아니거나 변환 실패 시 원본 저장
    out = buf;
    const rawExt = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    ext = /^(jpg|jpeg|png|webp|gif)$/.test(rawExt) ? rawExt : "jpg";
  }

  const filename = `col-${Date.now()}.${ext}`;
  await fs.mkdir(SAVE_DIR, { recursive: true });
  await fs.writeFile(path.join(SAVE_DIR, filename), out);

  return Response.json({ ok: true, url: `/uploads/${filename}` });
}
