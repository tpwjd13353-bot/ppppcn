import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import "@fontsource/pretendard";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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

export const metadata: Metadata = {
  title: "따종디엔핑 — 광고대행사",
  description: "성과로 증명하는 디지털 광고 파트너",
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
        <Header user={headerUser} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
