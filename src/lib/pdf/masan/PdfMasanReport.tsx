// 마산게낙찜·해마끼 간장게장 중국 마케팅 제안서 — 4페이지 합본
import { Document } from "@react-pdf/renderer";
import { PdfMasanPage1 } from "./PdfMasanPage1";
import { PdfMasanPage2 } from "./PdfMasanPage2";
import { PdfMasanPage3 } from "./PdfMasanPage3";
import { PdfMasanPage4 } from "./PdfMasanPage4";

interface Props {
  issuedAt: Date;
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function PdfMasanReport({
  issuedAt,
  contactName,
  contactTitle,
  contactPhone,
  contactEmail,
}: Props) {
  return (
    <Document
      title="마산게낙찜·해마끼 간장게장 중국 마케팅 제안서"
      author="퍼플페퍼"
      subject="마산게낙찜·해마끼 간장게장 — 해운대 게장 명가의 중국 관광객 매장 전환 & 샤오홍슈 자산화"
    >
      <PdfMasanPage1 issuedAt={issuedAt} />
      <PdfMasanPage2 />
      <PdfMasanPage3 />
      <PdfMasanPage4
        contactName={contactName}
        contactTitle={contactTitle}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
      />
    </Document>
  );
}
