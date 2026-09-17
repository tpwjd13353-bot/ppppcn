import type { Metadata, Viewport } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "@fontsource/pretendard";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { auth } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SITE_URL = "https://ppppcn.com";
const SITE_NAME = "퍼플페퍼 PURPLEPEPPER";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "중국마케팅 | 샤오홍슈·따종디엔핑 공식 대행사 퍼플페퍼",
    template: "%s | 퍼플페퍼",
  },
  description:
    "중국 관광객 유입 AI 상권 분석 무료 · 메이투안 본사 공식 대행사 퍼플페퍼. 매년 700만 방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 — 따종디엔핑·샤오홍슈·고덕지도·도우인·웨이보 통합 운영.",
  keywords: [
    "따종디엔핑",
    "다중디엔핑",
    "샤오홍슈",
    "중국 마케팅",
    "중국 관광객",
    "중국 인바운드",
    "MEITUAN",
    "메이투안",
    "고덕지도",
    "퍼플페퍼",
    "PURPLEPEPPER",
    "중국 광고대행사",
  ],
  authors: [{ name: "PURPLEPEPPER co., Ltd." }],
  creator: "PURPLEPEPPER co., Ltd.",
  publisher: "PURPLEPEPPER co., Ltd.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "중국마케팅 | 샤오홍슈·따종디엔핑 공식 대행사 퍼플페퍼",
    description:
      "중국 관광객 유입 AI 상권 분석 무료 · 메이투안 본사 공식 대행사 퍼플페퍼. 매년 700만 방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 — 따종디엔핑·샤오홍슈·고덕지도·도우인·웨이보 통합 운영.",
  },
  twitter: {
    card: "summary_large_image",
    title: "중국마케팅 | 샤오홍슈·따종디엔핑 공식 대행사 퍼플페퍼",
    description:
      "중국 관광객 유입 AI 상권 분석 무료 · 메이투안 본사 공식 대행사 퍼플페퍼. 매년 700만 방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // 검색엔진 소유권 확인 (환경변수로 값 주입).
  // - 구글: Next.js 전용 필드 verification.google 사용 (표준 태그 형식 100% 보장)
  // - 네이버: 전용 필드가 없어 verification.other로 넣음
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_NAVER_VERIFICATION
      ? {
          other: {
            "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION,
          },
        }
      : {}),
  },
  category: "marketing",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0F2845" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2845" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const headerUser = session?.user
    ? {
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <html
      lang="ko"
      className={`dark ${inter.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <JsonLd />
        <Header user={headerUser} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
