// 모든 페이지에 깔리는 흑백 배경 이미지 (풀브리드).
//
// Page 의 padding 을 0 으로 두고 (styles.page),
// 콘텐츠는 pageInner View 안에 패딩 36 으로 들어감.
// BackgroundImage 는 Image 직접 absolute 풀브리드.

import path from "node:path";
import { Image } from "@react-pdf/renderer";

const BG_PATH = path.join(process.cwd(), "public/images/page1-bg.jpg");
const DEFAULT_OPACITY = 0.12;

export function BackgroundImage({ opacity = DEFAULT_OPACITY }: { opacity?: number }) {
  return (
    <Image
      src={BG_PATH}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
      }}
    />
  );
}
