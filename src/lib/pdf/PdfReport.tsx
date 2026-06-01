// 통합 PDF Document — 3페이지 합본
//
// 폰트는 이 파일 모듈 로드 시점에 즉시 등록.
// (fonts.ts 별도 모듈로 분리하면 tsx/Next 환경에서 모듈 인스턴스 격리로
//  Font.register 가 다른 인스턴스에 등록되는 이슈가 있었음)

import { Document } from "@react-pdf/renderer";
import { PdfPage1 } from "./PdfPage1";
import { PdfPage2 } from "./PdfPage2";
import { PdfPage3 } from "./PdfPage3";
import { pickScenario } from "./scenario";
import type { LossEstimate } from "@/lib/analyze/lossEstimate";
import type { AnalysisResult } from "@/lib/types/scoring";
import type { NaverPlaceData } from "@/lib/analyze/naver";

// 주의: 폰트 등록은 렌더 호출자(API 라우트)에서 registerPdfFonts() 직접 호출.
// 같은 모듈 인스턴스 보장을 위해 PdfReport 안에서 등록하지 않음.

interface Props {
  place: NaverPlaceData;
  result: AnalysisResult;
  loss: LossEstimate | null;
  analyzedAt: Date;
  reportId: string;
  contactKakao?: string;
  contactPhone?: string;
}

export function PdfReport(props: Props) {
  const scenario = pickScenario(props.result);

  return (
    <Document
      title={`${props.place.name} 상권 진단 보고서`}
      author="퍼플페퍼"
      subject="중국 관광객 상권 분석"
    >
      <PdfPage1
        place={props.place}
        result={props.result}
        scenario={scenario}
        loss={props.loss}
        analyzedAt={props.analyzedAt}
        reportId={props.reportId}
      />
      <PdfPage2
        place={props.place}
        result={props.result}
        scenario={scenario}
        loss={props.loss}
      />
      <PdfPage3
        place={props.place}
        scenario={scenario}
        contactKakao={props.contactKakao}
        contactPhone={props.contactPhone}
      />
    </Document>
  );
}
