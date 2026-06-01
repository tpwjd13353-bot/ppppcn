// 변경된 PDF 보고서 로컬 미리보기 — 종로구 샘플 데이터로 렌더
// 실행: npx tsx --tsconfig tsconfig.json scripts/preview-pdf.tsx
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { PdfReport } from "@/lib/pdf/PdfReport";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";
import { estimateLoss } from "@/lib/analyze/lossEstimate";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import type { AnalysisResult } from "@/lib/types/scoring";

registerPdfFonts();

const place: NaverPlaceData = {
  placeId: "sample",
  name: "샘플식당 종로점",
  address: "서울특별시 종로구 인사동길 10",
  roadAddress: "서울특별시 종로구 인사동길 10",
  category: "한식 / 고깃집",
  menus: [
    "고추장삼겹살",
    "차돌박이",
    "흑돼지삼겹살",
    "목살",
    "숯불돼지갈비",
    "부채살",
    "된장찌개",
    "공기밥",
  ],
  sourceUrl: "https://example.com",
  partial: false,
  notes: [],
};

const result: AnalysisResult = {
  store: { score: 78, grade: "B+", label: "양호" },
  marketing: { score: 25, grade: "F", label: "낮음", message: "중국 채널 노출 거의 없음" } as AnalysisResult["marketing"],
  details: {
    region: {
      score: 90,
      match: { matched: true, tier: "상권", matchedName: "인사동" },
      needsConsultation: false,
    },
    menu: {
      score: 96,
      matchedCount: 6,
      unmatchedCount: 0,
      matches: [
        { input: "고추장삼겹살", matched: true, menuName: "삼겹살", score: 100, 분류: "절대선호" },
        { input: "차돌박이", matched: true, menuName: "차돌박이", score: 100, 분류: "절대선호" },
        { input: "흑돼지삼겹살", matched: true, menuName: "삼겹살", score: 100, 분류: "절대선호" },
        { input: "목살", matched: true, menuName: "목살구이", score: 100, 분류: "절대선호" },
        { input: "숯불돼지갈비", matched: true, menuName: "돼지갈비", score: 90, 분류: "매우선호" },
        { input: "부채살", matched: true, menuName: "부채살", score: 90, 분류: "매우선호" },
      ],
      needsConsultation: false,
    },
  },
  conclusion: "메뉴는 우수하나 중국 채널 노출이 부족합니다.",
  consultation: { recommended: true, reasons: ["마케팅 약점"], priority: "high" },
};

const loss = estimateLoss("서울특별시", "종로구");

async function main() {
  const doc = PdfReport({
    place,
    result,
    loss,
    analyzedAt: new Date(),
    reportId: "PREVIEW-000001",
    contactKakao: "https://open.kakao.com/o/skmX5Pwi",
    contactPhone: "010-2991-5990",
  });
  const buf = await renderToBuffer(doc);
  const out = path.resolve("/tmp/preview-report.pdf");
  fs.writeFileSync(out, buf);
  console.log(`✓ saved: ${out}`);
  try {
    execSync(`open "${out}"`);
  } catch {}
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
