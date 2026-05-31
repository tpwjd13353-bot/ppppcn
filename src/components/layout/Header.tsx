"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Download, LogOut, Menu, User, X } from "lucide-react";
import { signOutAction } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/analyze", label: "분석", highlight: true },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type HeaderUser = {
  name: string | null;
  image: string | null;
} | null;

const PROPOSAL_OPTIONS = [
  { label: "따종디엔핑", file: "/proposal-dianping.pdf" },
  { label: "뷰티", file: "/proposal-beauty.pdf" },
  { label: "외식", file: "/proposal-food.pdf" },
  { label: "레저", file: "/proposal-leisure.pdf" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Header({ user }: { user: HeaderUser }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="font-display text-xl tracking-tight"
        >
          PURPLEPEPPER
        </Link>

        {/* 데스크탑 내비게이션 */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.highlight
                  ? "relative font-semibold text-primary transition-colors hover:opacity-80"
                  : "text-foreground/80 transition-colors hover:text-primary"
              }
            >
              {item.label}
              {item.highlight && (
                <span className="ml-1.5 inline-flex h-4 items-center rounded-full bg-primary/15 px-1.5 text-[10px] font-bold uppercase tracking-wide">
                  무료
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* 데스크탑 버튼 */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setProposalOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            <Download className="h-4 w-4" />
            제안서
          </button>
          {user ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground/20 px-3 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
                aria-label="로그아웃"
              >
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? "user"}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="max-w-[120px] truncate">{user.name ?? "회원"}</span>
                <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              로그인
            </Link>
          )}
          <Link
            href="/contact"
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            문의하기
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="메뉴 열기"
          className="text-foreground md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* 모바일 메뉴 드로어 */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                className="fixed inset-0 z-[90] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col border-l border-border/40 bg-background p-6"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <button
                    onClick={() => setMenuOpen(false)}
                    aria-label="메뉴 닫기"
                    className="self-end text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <nav className="mt-6 flex flex-col">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={
                          item.highlight
                            ? "flex items-center justify-between border-b border-border/20 py-4 text-lg font-semibold text-primary transition hover:opacity-80"
                            : "border-b border-border/20 py-4 text-lg font-medium text-foreground/90 transition hover:text-primary"
                        }
                      >
                        <span>{item.label}</span>
                        {item.highlight && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                            무료
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto flex flex-col gap-3">
                    {user ? (
                      <div className="flex items-center justify-between rounded-full border border-border/40 px-4 py-2">
                        <span className="flex items-center gap-2 text-sm">
                          {user.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.image}
                              alt={user.name ?? "user"}
                              className="h-7 w-7 rounded-full"
                            />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          <span className="max-w-[120px] truncate font-medium">
                            {user.name ?? "회원"}
                          </span>
                        </span>
                        <form action={signOutAction}>
                          <button
                            type="submit"
                            className="text-xs text-muted-foreground transition hover:text-primary"
                          >
                            로그아웃
                          </button>
                        </form>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-foreground/20 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                      >
                        로그인 / 가입
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setProposalOpen(true);
                      }}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-foreground/20 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                    >
                      <Download className="h-4 w-4" />
                      제안서 다운로드
                    </button>
                    <Link
                      href="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      문의하기
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* 제안서 다운로드 모달 */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {proposalOpen && (
              <motion.div
                key="proposal-modal"
                className="fixed inset-0 z-[100] flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={() => setProposalOpen(false)}
                />
                <motion.div
                  className="relative z-10 w-full max-w-md rounded-2xl border border-border/40 bg-background p-8"
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <button
                    onClick={() => setProposalOpen(false)}
                    aria-label="닫기"
                    className="absolute right-4 top-4 text-muted-foreground transition hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <h3 className="font-heading text-2xl font-bold">제안서 다운로드</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    업종을 선택하면 맞춤 제안서를 받을 수 있어요.
                  </p>

                  <div className="mt-6 grid gap-3">
                    {PROPOSAL_OPTIONS.map((o, i) => (
                      <motion.a
                        key={o.file}
                        href={o.file}
                        download
                        onClick={() => setProposalOpen(false)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.06, duration: 0.3, ease: EASE }}
                        className="group flex items-center justify-between rounded-xl border border-border/40 p-5 transition hover:border-primary hover:bg-primary/[0.04]"
                      >
                        <span className="font-heading text-lg font-bold transition-colors group-hover:text-primary">
                          {o.label}
                        </span>
                        <Download className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
