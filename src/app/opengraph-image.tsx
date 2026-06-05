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
          padding: "72px 120px",
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.0) 45%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.8) 100%), url(${bgDataUri})`,
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
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 6,
                height: 28,
                background: "#ff2d2d",
                boxShadow: "0 0 16px #ff2d2d",
              }}
            />
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
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 22px",
              border: "1.6px solid #ff2d2d",
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#ff5a5a",
              background: "rgba(255,45,45,0.08)",
            }}
          >
            ★ MEITUAN OFFICIAL PARTNER
          </div>
        </div>

        {/* 중앙: 메인 카피 */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#FFFFFF",
            }}
          >
            중국 관광객,
          </div>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2,
              color: "#ff2d2d",
            }}
          >
            우리 가게로.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.78)",
              fontWeight: 500,
            }}
          >
            따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 400,
            }}
          >
            방한 중국 관광객 매장 전환 · 메이투안 본사 정식 인증 대행사
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: "#ff2d2d",
                boxShadow: "0 0 12px #ff2d2d",
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              ppppcn.com
            </span>
          </div>
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 500,
              letterSpacing: 0.5,
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
