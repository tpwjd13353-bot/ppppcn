// TWW 제안서 PDF 생성
// 실행: npx tsx --tsconfig tsconfig.json scripts/generate-tww-proposal.tsx
import { renderToBuffer } from "@react-pdf/renderer";
import fs from "node:fs";
import path from "node:path";
import { PdfTwwReport } from "@/lib/pdf/tww/PdfTwwReport";
import { registerPdfFonts } from "@/lib/pdf/registerFonts";

registerPdfFonts();

async function main() {
  const doc = PdfTwwReport({
    issuedAt: new Date(),
    contactName: "김세정 본부장",
    contactTitle: "퍼플페퍼 (PURPLEPEPPER co., Ltd.)",
    contactPhone: "010-2991-5990",
    contactEmail: "sejeong13@pppp.team",
  });
  const buf = await renderToBuffer(doc);

  const outDir = path.resolve("public", "proposals");
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, "tww-china-marketing-proposal.pdf");
  fs.writeFileSync(out, buf);
  console.log(`✓ saved: ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
