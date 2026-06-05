// 동적 제안서 — 4페이지 합본
import { Document } from "@react-pdf/renderer";
import { PdfDynamicPage1 } from "./PdfDynamicPage1";
import { PdfDynamicPage2 } from "./PdfDynamicPage2";
import { PdfDynamicPage3 } from "./PdfDynamicPage3";
import { PdfDynamicPage4 } from "./PdfDynamicPage4";
import type { ProposalData } from "@/lib/proposal/types";

interface Props {
  data: ProposalData;
  contactName?: string;
  contactTitle?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export function PdfDynamicReport({
  data,
  contactName,
  contactTitle,
  contactPhone,
  contactEmail,
}: Props) {
  const clientName = data.meta.clientName || "클라이언트";
  return (
    <Document
      title={`${clientName} 중국 마케팅 제안서`}
      author="퍼플페퍼"
      subject={`${clientName} — 중국 관광객 매장 전환 & 샤오홍슈 자산화 제안`}
    >
      <PdfDynamicPage1 data={data} clientName={clientName} />
      <PdfDynamicPage2 data={data} clientName={clientName} />
      <PdfDynamicPage3 data={data} clientName={clientName} />
      <PdfDynamicPage4
        data={data}
        clientName={clientName}
        contact={{
          name: contactName,
          title: contactTitle,
          phone: contactPhone,
          email: contactEmail,
        }}
      />
    </Document>
  );
}
