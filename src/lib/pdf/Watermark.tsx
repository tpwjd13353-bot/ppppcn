// PDF 워터마크 — 각 페이지 배경에 대각선 패턴
// 데이터 가독성에 영향 없는 매우 옅은 톤. 캡쳐·재배포 추적용.
import { View, Text } from "@react-pdf/renderer";

interface Props {
  reportId?: string;
}

export function Watermark({ reportId }: Props) {
  // 대각선 PURPLEPEPPER · ppppcn.com 텍스트 6줄 반복
  const rows = [80, 200, 320, 440, 560, 680];
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
      fixed
    >
      {rows.map((y) => (
        <Text
          key={y}
          style={{
            position: "absolute",
            top: y,
            left: -40,
            fontSize: 28,
            fontWeight: 800,
            color: "#000000",
            opacity: 0.04,
            transform: "rotate(-22deg)",
            fontFamily: "Pretendard",
          }}
        >
          PURPLEPEPPER · ppppcn.com · PURPLEPEPPER · ppppcn.com
        </Text>
      ))}
      {reportId && (
        <Text
          style={{
            position: "absolute",
            bottom: 6,
            right: 36,
            fontSize: 6,
            color: "#838999",
            fontFamily: "Pretendard",
          }}
        >
          REPORT ID: {reportId}
        </Text>
      )}
    </View>
  );
}
