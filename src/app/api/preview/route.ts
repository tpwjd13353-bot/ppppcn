import sharp from "sharp";
import { saveMedia, mediaUrl } from "@/lib/storage";
import { requireAdmin } from "@/lib/admin";

function toHttps(u: string) {
  return u.replace(/^http:/, "https:");
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return new Response("Unauthorized", { status: 401 });

  let url = "";
  try {
    const body = (await req.json()) as { url?: string };
    url = body.url ?? "";
  } catch {
    return Response.json({ ok: false, error: "bad_request" });
  }
  if (!url) return Response.json({ ok: false, error: "no_url" });

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
  const title = rawTitle
    .replace(/\s*-\s*(小红书|抖音|Instagram|TikTok).*$/i, "")
    .trim();
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

    const imgBuf = Buffer.from(await imgRes.arrayBuffer());
    let out: Buffer;
    try {
      out = await sharp(imgBuf)
        .resize(1280, 1600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      out = imgBuf;
    }

    const filename = `preview-${Date.now()}.webp`;
    await saveMedia(filename, out);

    return Response.json({
      ok: true,
      title,
      savedPath: mediaUrl(filename),
      videoUrl,
      author,
    });
  } catch {
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
