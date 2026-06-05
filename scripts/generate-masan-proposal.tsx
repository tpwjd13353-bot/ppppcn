// 마산게낙찜·해마끼 간장게장 제안서 PDF 생성
// 실행: npx tsx --tsconfig tsconfig.json scripts/generate-masan-proposal.tsx
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";
import { PdfMasanReport } from "@/lib/pdf/masan/PdfMasanReport";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";

registerPdfFonts();

async function main() {
  const doc = PdfMasanReport({
    issuedAt: new Date(),
    contactName: "김세정 본부장",
    contactTitle: "퍼플페퍼 (PURPLEPEPPER co., Ltd.)",
    contactPhone: "010-2991-5990",
    contactEmail: "sejeong13@pppp.team",
  });
  const buf = await renderToBuffer(doc);

  const outDir = path.resolve("public", "proposals");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "masan-china-marketing-proposal.pdf");
  fs.writeFileSync(out, buf);
  console.log(`✓ saved: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
