import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "퍼플페퍼 — 중국 관광객 마케팅 · 따종디엔핑 공식 대행사";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const fontBold = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/Pretendard-Bold.otf"),
  );
  const fontSemi = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/Pretendard-SemiBold.otf"),
  );
  const fontReg = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/Pretendard-Regular.otf"),
  );

  const bg = fs.readFileSync(path.join(process.cwd(), "public/og-bg.png"));
  const bgDataUri = `data:image/png;base64,${bg.toString("base64")}`;

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
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 28%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.25) 78%, rgba(0,0,0,0.7) 100%), url(${bgDataUri})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#FFFFFF",
          fontFamily: "Pretendard",
        }}
      >
        {/* 상단: 브랜드 + MEITUAN 뱃지 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
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
              padding: "10px 22px",
              border: "1.6px solid rgba(255,255,255,0.7)",
              borderRadius: 9999,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#FFFFFF",
            }}
          >
            ★ MEITUAN OFFICIAL PARTNER
          </div>
        </div>

        {/* 중앙: 메인 카피 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: -2,
              color: "#FFFFFF",
            }}
          >
            중국 관광객, 우리 가게로.
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
            }}
          >
            방한 중국 관광객 매장 전환 · 메이투안 본사 정식 인증
          </div>
        </div>

        {/* 하단: 도메인 + 카피 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            ppppcn.com
          </span>
          <span
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 500,
            }}
          >
            중국 마케팅 전문 대행사
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: fontReg, weight: 400, style: "normal" },
        { name: "Pretendard", data: fontSemi, weight: 500, style: "normal" },
        { name: "Pretendard", data: fontBold, weight: 700, style: "normal" },
      ],
    },
  );
}
