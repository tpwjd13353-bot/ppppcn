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
    default: "퍼플페퍼 — 중국 관광객 마케팅 · 따종디엔핑 공식 대행사",
    template: "%s | 퍼플페퍼",
  },
  description:
    "방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 대행사. 따종디엔핑·샤오홍슈·고덕지도·도우인·웨이보. 메이투안 본사 정식 인증.",
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
    title: "퍼플페퍼 — 중국 관광객 마케팅 · 따종디엔핑 공식 대행사",
    description:
      "방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 대행사. 메이투안 본사 정식 인증.",
  },
  twitter: {
    card: "summary_large_image",
    title: "퍼플페퍼 — 중국 관광객 마케팅 · 따종디엔핑 공식 대행사",
    description:
      "방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 대행사.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // 네이버 웹마스터 도구 소유 확인 (발급 후 값 교체)
  verification: {
    other: {
      "naver-site-verification":
        process.env.NEXT_PUBLIC_NAVER_VERIFICATION ?? "",
      ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
        ? { "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION }
        : {}),
    },
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
