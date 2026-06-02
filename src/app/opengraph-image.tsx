import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "퍼플페퍼 — 중국 관광객 마케팅 · 따종디엔핑 공식 대행사";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0F2845 0%, #1F3A5F 60%, #2D2A55 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 4,
              color: "#FFFFFF",
            }}
          >
            PURPLEPEPPER
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              border: "2px solid rgba(255,255,255,0.5)",
              borderRadius: 9999,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#FFFFFF",
            }}
          >
            ★ MEITUAN OFFICIAL PARTNER
          </div>
        </div>

        {/* 중앙 메인 카피 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: -2,
              color: "#FFFFFF",
            }}
          >
            중국 관광객, 우리 가게로.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 32,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.78)",
              fontWeight: 500,
            }}
          >
            따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: "rgba(255,255,255,0.6)",
              fontWeight: 400,
            }}
          >
            방한 중국 관광객 매장 전환 · 메이투안 본사 정식 인증
          </div>
        </div>

        {/* 하단 도메인 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 1,
          }}
        >
          <span>ppppcn.com</span>
          <span>중국 마케팅 전문 대행사</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
