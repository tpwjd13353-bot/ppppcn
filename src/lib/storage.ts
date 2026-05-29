import { promises as fs } from "node:fs";
import path from "node:path";

// Railway Volume 마운트 경로(예: /data). 없으면 로컬 경로 사용.
const STORAGE_DIR = process.env.STORAGE_DIR;
const cwd = process.cwd();

// 데이터(JSON) / 미디어(이미지) 저장 위치
export const DATA_DIR = STORAGE_DIR
  ? path.join(STORAGE_DIR, "data")
  : path.join(cwd, "src/data");
export const MEDIA_DIR = STORAGE_DIR
  ? path.join(STORAGE_DIR, "media")
  : path.join(cwd, "public/uploads");

// 코드에 포함된 초기값(시드) 위치
const SEED_DATA = path.join(cwd, "src/data");
const SEED_MEDIA = path.join(cwd, "public/uploads");

// JSON 읽기: 영속 경로에 없으면 시드에서 복사 후 반환
export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  const target = path.join(DATA_DIR, filename);
  try {
    return JSON.parse(await fs.readFile(target, "utf-8")) as T;
  } catch {
    try {
      const seed = await fs.readFile(path.join(SEED_DATA, filename), "utf-8");
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.writeFile(target, seed, "utf-8");
      return JSON.parse(seed) as T;
    } catch {
      return fallback;
    }
  }
}

export async function writeJson(filename: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, filename),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
}

// 미디어 디렉토리 시딩: Volume이 비어있으면 빌드에 포함된 초기 이미지 복사 (1회)
let mediaSeeded = false;
export async function ensureMediaSeed(): Promise<void> {
  if (mediaSeeded) return;
  mediaSeeded = true;
  if (!STORAGE_DIR) return; // 로컬은 public/uploads 그대로 사용
  try {
    await fs.mkdir(MEDIA_DIR, { recursive: true });
    const existing = await fs.readdir(MEDIA_DIR);
    if (existing.length > 0) return;
    const seeds = await fs.readdir(SEED_MEDIA);
    await Promise.all(
      seeds.map((f) =>
        fs.copyFile(path.join(SEED_MEDIA, f), path.join(MEDIA_DIR, f)),
      ),
    );
  } catch {
    /* ignore */
  }
}

export async function saveMedia(filename: string, buf: Buffer): Promise<void> {
  await fs.mkdir(MEDIA_DIR, { recursive: true });
  await fs.writeFile(path.join(MEDIA_DIR, filename), buf);
}

// 이미지 접근 URL (정적 경로가 아니라 서빙 API 경유 — Volume 대응)
export function mediaUrl(filename: string): string {
  return `/api/media/${filename}`;
}
