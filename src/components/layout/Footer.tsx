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

        <div className="mt-12 border-t border-border/40 pt-6">
          <div className="grid gap-x-6 gap-y-1.5 text-[11px] leading-relaxed text-muted-foreground/80 md:grid-cols-[auto_1fr]">
            <span className="font-medium text-muted-foreground">상호</span>
            <span>(주)퍼플페퍼 · PURPLEPEPPER co., Ltd.</span>
            <span className="font-medium text-muted-foreground">대표</span>
            <span>임수백</span>
            <span className="font-medium text-muted-foreground">사업자등록번호</span>
            <span>319-81-03045</span>
            <span className="font-medium text-muted-foreground">주소</span>
            <span>서울특별시 마포구 와우산로17길 19-18 퍼플페퍼 사옥 3층</span>
            <span className="font-medium text-muted-foreground">개인정보 보호책임자</span>
            <span>김세정 · sejeong13@pppp.team</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground/70">
            <Link href="/terms" className="hover:text-foreground">
              서비스 이용약관
            </Link>
            <span className="text-muted-foreground/40">·</span>
            <Link href="/privacy" className="font-semibold text-foreground hover:text-primary">
              개인정보처리방침
            </Link>
          </div>

          <div className="mt-5 flex flex-col gap-2 text-[11px] text-muted-foreground/70 md:flex-row md:items-center md:justify-between">
            <p>
              © {year} PURPLEPEPPER co., Ltd. · 따종디엔핑 · 샤오홍슈 · 메이투안 본사 정식 인증 대행사
            </p>
            <p className="font-body-en">
              Connecting Chinese travelers to Korean stores.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
