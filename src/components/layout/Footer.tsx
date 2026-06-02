import Link from "next/link";
import { Award, Mail, Phone } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* 브랜드 + 메이투안 인증 */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="font-display text-2xl tracking-tight">
                PURPLEPEPPER
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                <Award className="h-3 w-3" />
                Meituan Official
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              방한 중국 관광객을 매장으로 연결하는 중국 마케팅 전문 대행사.
              <br />
              따종디엔핑 · 샤오홍슈 · 고덕지도 · 도우인 · 웨이보.
            </p>

            <div className="mt-6 space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <a href="tel:01029915990" className="hover:text-foreground">
                  010-2991-5990
                </a>
                <span className="text-muted-foreground/50">담당 김세정 본부장</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <a href="mailto:sejeong13@pppp.team" className="hover:text-foreground">
                  sejeong13@pppp.team
                </a>
              </p>
            </div>
          </div>

          {/* 메뉴 컬럼들 */}
          <div className="md:col-span-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              회사
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-primary">
                  레퍼런스
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              서비스
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary">
                  대행 서비스
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-primary">
                  상권 분석
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-primary">
                  칼럼
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
              상담
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary">
                  무료 상담 신청
                </Link>
              </li>
              <li>
                <a
                  href="https://open.kakao.com/o/skmX5Pwi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  카카오 오픈채팅
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} PURPLEPEPPER co., Ltd. · 따종디엔핑 · 샤오홍슈 · 메이투안 본사 정식 인증 대행사
          </p>
          <p className="font-body-en text-muted-foreground/70">
            Connecting Chinese travelers to Korean stores.
          </p>
        </div>
      </div>
    </footer>
  );
}
