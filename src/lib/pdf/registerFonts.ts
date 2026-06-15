// PDF 폰트 등록
//
// API 라우트 / 렌더 호출자에서 PdfReport 사용 전에 호출.
// "@react-pdf/renderer" 의 Font 객체는 모듈 격리가 발생할 수 있어
// 렌더 호출자와 같은 모듈 import 트리에서 등록하는 게 안전.
//
// 한자(简体·繁體) 글리프는 Pretendard에 포함되지 않아 .notdef로 깨졌음.
// → 본문 기본 폰트를 NotoSansSC로 통일. 한국어 글리프도 함께 그려져 한국어/한자 혼용 가능.
// Pretendard family도 함께 등록(기존 코드 호환·헤드라인 등에서 명시적으로 쓸 수 있게).

import { Font } from "@react-pdf/renderer";
import path from "node:path";

let registered = false;

export function registerPdfFonts(): void {
  if (registered) return;

  const fontDir = path.join(process.cwd(), "public/fonts");

  Font.register({
    family: "Pretendard",
    fonts: [
      { src: path.join(fontDir, "Pretendard-Regular.otf"), fontWeight: 400 },
      { src: path.join(fontDir, "Pretendard-SemiBold.otf"), fontWeight: 600 },
      { src: path.join(fontDir, "Pretendard-Bold.otf"), fontWeight: 700 },
    ],
  });

  // 한·중 통합 본문 폰트 — Noto Sans SC. 한국어/简体字 모두 그림.
  Font.register({
    family: "NotoSansSC",
    fonts: [
      { src: path.join(fontDir, "NotoSansSC-Regular.otf"), fontWeight: 400 },
      { src: path.join(fontDir, "NotoSansSC-Regular.otf"), fontWeight: 600 },
      { src: path.join(fontDir, "NotoSansSC-Bold.otf"), fontWeight: 700 },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
