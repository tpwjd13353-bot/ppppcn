import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="font-display text-2xl tracking-tight">PURPLEPEPPER</div>
            <p className="mt-3 text-sm text-muted-foreground">
              따종디엔핑 공식 대행사<br />
              메이투안 본사 정식 인증
            </p>
            <p className="mt-4 text-xs text-muted-foreground/70">
              sejeong13@pppp.team · 010-2991-5990
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About</Link></li>
              <li><Link href="/work" className="hover:text-primary">Work</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Services</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
              <li><Link href="/insights" className="hover:text-primary">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary">문의하기</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {year} PURPLEPEPPER co., Ltd. All rights reserved.</p>
          <p className="font-body-en">Built with Next.js · Tailwind · Framer Motion</p>
        </div>
      </div>
    </footer>
  );
}
