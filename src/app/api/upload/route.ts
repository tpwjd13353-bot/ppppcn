import sharp from "sharp";
import { saveMedia, mediaUrl } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

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

  // webp 변환 + 리사이즈로 자동 최적화
  let out: Buffer;
  let ext = "webp";
  try {
    out = await sharp(buf)
      .rotate()
      .resize(1280, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    out = buf;
    const rawExt = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    ext = /^(jpg|jpeg|png|webp|gif)$/.test(rawExt) ? rawExt : "jpg";
  }

  const filename = `col-${Date.now()}.${ext}`;
  await saveMedia(filename, out);

  return Response.json({ ok: true, url: mediaUrl(filename) });
}
