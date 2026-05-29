import { promises as fs } from "node:fs";
import path from "node:path";

const FALLBACK_PASSWORD = "ddj2026";
const SAVE_DIR = path.join(process.cwd(), "public/showcase");

function toHttps(u: string) {
  return u.replace(/^http:/, "https:");
}

export async function POST(req: Request) {
  const pw = req.headers.get("x-admin-password") ?? "";
  const expected = process.env.ADMIN_PASSWORD ?? FALLBACK_PASSWORD;
  if (pw !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  let url = "";
  try {
    const body = (await req.json()) as { url?: string };
    url = body.url ?? "";
  } catch {
    return Response.json({ ok: false, error: "bad_request" });
  }
  if (!url) return Response.json({ ok: false, error: "no_url" });

  // 1) microlink로 미리보기 메타 추출 (제목 + 썸네일)
  let meta: {
    status?: string;
    data?: {
      title?: string;
      author?: string;
      image?: { url?: string };
      video?: { url?: string };
    };
  };
  try {
    const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
    const res = await fetch(api, { cache: "no-store" });
    meta = await res.json();
  } catch {
    return Response.json({ ok: false, error: "preview_failed" });
  }

  if (meta?.status !== "success") {
    return Response.json({ ok: false, error: "no_preview" });
  }

  const rawTitle = meta.data?.title ?? "";
  const title = rawTitle.replace(/\s*-\s*(小红书|抖音|Instagram|TikTok).*$/i, "").trim();
  const imageUrl = meta.data?.image?.url;
  const videoUrl = meta.data?.video?.url ?? "";
  const rawAuthor = meta.data?.author ?? "";
  const author = rawAuthor
    ? rawAuthor.startsWith("@")
      ? rawAuthor
      : `@${rawAuthor}`
    : "";

  if (!imageUrl) {
    return Response.json({ ok: true, title, savedPath: "", videoUrl, author });
  }

  // 2) 썸네일을 우리 서버에 다운로드 (referer 위조로 차단 우회)
  try {
    const imgRes = await fetch(toHttps(imageUrl), {
      headers: {
        Referer: "https://www.xiaohongshu.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      cache: "no-store",
    });
    if (!imgRes.ok) throw new Error("img_fetch_failed");

    const ctype = imgRes.headers.get("content-type") ?? "";
    const ext = ctype.includes("png")
      ? "png"
      : ctype.includes("webp")
        ? "webp"
        : "jpg";
    const buf = Buffer.from(await imgRes.arrayBuffer());

    await fs.mkdir(SAVE_DIR, { recursive: true });
    const filename = `preview-${Date.now()}.${ext}`;
    await fs.writeFile(path.join(SAVE_DIR, filename), buf);

    return Response.json({
      ok: true,
      title,
      savedPath: `/showcase/${filename}`,
      videoUrl,
      author,
    });
  } catch {
    // 다운로드 실패 시 원본 https URL이라도 돌려줌
    return Response.json({
      ok: true,
      title,
      savedPath: "",
      imageUrl: toHttps(imageUrl),
      videoUrl,
      author,
    });
  }
}
