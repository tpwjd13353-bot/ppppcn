import { promises as fs } from "node:fs";
import path from "node:path";
import { MEDIA_DIR, ensureMediaSeed } from "@/lib/storage";

const TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  await ensureMediaSeed();
  const { name } = await params;

  const filePath = path.join(MEDIA_DIR, name);
  // 경로 탈출 방지
  if (!path.resolve(filePath).startsWith(path.resolve(MEDIA_DIR))) {
    return new Response("Not Found", { status: 404 });
  }

  try {
    const buf = await fs.readFile(filePath);
    const ext = (name.split(".").pop() ?? "").toLowerCase();
    const type = TYPES[ext] ?? "application/octet-stream";
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
