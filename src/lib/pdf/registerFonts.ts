// PDF 폰트 등록
//
// API 라우트 / 렌더 호출자에서 PdfReport 사용 전에 호출.
// "@react-pdf/renderer" 의 Font 객체는 모듈 격리가 발생할 수 있어
// 렌더 호출자와 같은 모듈 import 트리에서 등록하는 게 안전.
//
// 한·중 혼용 본문 폰트 — Source Han Sans KR (= Noto Sans CJK KR, 동일 폰트의 다른 이름).
// 한국어 우선 디자인 + 한·중·일 한자(简体·繁體) 모두 포함이라 한글/한자 혼용 텍스트를
// 단일 폰트로 깔끔하게 그립니다. @react-pdf/renderer는 글리프 fallback을 지원하지 않아
// 본문 폰트 자체를 한·중 통합 폰트로 통일하는 방식 사용.

import { Font } from "@react-pdf/renderer";
import path from "node:path";

let registered = false;

export function registerPdfFonts(): void {
  if (registered) return;

  const fontDir = path.join(process.cwd(), "public/fonts");

  // Pretendard — 헤드라인·영문 강조 등 명시적으로 쓰고 싶은 자리용으로 유지
  Font.register({
    family: "Pretendard",
    fonts: [
      { src: path.join(fontDir, "Pretendard-Regular.otf"), fontWeight: 400 },
      { src: path.join(fontDir, "Pretendard-SemiBold.otf"), fontWeight: 600 },
      { src: path.join(fontDir, "Pretendard-Bold.otf"), fontWeight: 700 },
    ],
  });

  // 본문 통합 폰트 — Source Han Sans KR (Noto Sans CJK KR 동일).
  // 한국어 우선 디자인이라 한글이 자연스럽고, 简体·繁體 한자도 같은 family 안에서 모두 그려짐.
  Font.register({
    family: "SourceHanSansKR",
    fonts: [
      { src: path.join(fontDir, "SourceHanSansKR-Regular.otf"), fontWeight: 400 },
      { src: path.join(fontDir, "SourceHanSansKR-Regular.otf"), fontWeight: 600 },
      { src: path.join(fontDir, "SourceHanSansKR-Bold.otf"), fontWeight: 700 },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);

  registered = true;
}
