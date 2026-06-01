// Pretendard 한글 폰트 등록
//
// API 라우트 / 렌더 호출자에서 PdfReport 사용 전에 호출.
// "@react-pdf/renderer" 의 Font 객체는 모듈 격리가 발생할 수 있어
// 렌더 호출자와 같은 모듈 import 트리에서 등록하는 게 안전.

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

  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
