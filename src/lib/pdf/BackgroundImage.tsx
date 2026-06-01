// 흑백 배경 이미지 (1페이지에만 적용)
//
// 주의: @react-pdf v4 에서 같은 Image 를 여러 페이지에 동시 적용 시
//   "IMAGE can't wrap between pages" 경고와 페이지 분할 이슈가 발생.
//   현재는 1페이지 (PdfPage1) 에만 적용. View 래퍼 + right/bottom=0 패턴.

import path from "node:path";
import { Image, View } from "@react-pdf/renderer";

const BG_PATH = path.join(process.cwd(), "public/images/page1-bg.jpg");
const DEFAULT_OPACITY = 0.15;

export function BackgroundImage({ opacity = DEFAULT_OPACITY }: { opacity?: number }) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        overflow: "hidden",
      }}
    >
      <Image src={BG_PATH} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}
