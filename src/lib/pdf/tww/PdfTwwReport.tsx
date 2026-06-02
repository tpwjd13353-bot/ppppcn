// TWW 중국 마케팅 제안서 — 4페이지 합본
import { Document } from "@react-pdf/renderer";
import { PdfTwwPage1 } from "./PdfTwwPage1";
import { PdfTwwPage2 } from "./PdfTwwPage2";
import { PdfTwwPage3 } from "./PdfTwwPage3";
import { PdfTwwPage4 } from "./PdfTwwPage4";

interface Props {
  issuedAt: Date;
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function PdfTwwReport({
  issuedAt,
  contactName,
  contactTitle,
  contactPhone,
  contactEmail,
}: Props) {
  return (
    <Document
      title="TWW 중국 마케팅 제안서"
      author="퍼플페퍼"
      subject="TWW (주)나리온 — 중국 관광객 매장 전환 & 샤오홍슈 자산화"
    >
      <PdfTwwPage1 issuedAt={issuedAt} />
      <PdfTwwPage2 />
      <PdfTwwPage3 />
      <PdfTwwPage4
        contactName={contactName}
        contactTitle={contactTitle}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
      />
    </Document>
  );
}
