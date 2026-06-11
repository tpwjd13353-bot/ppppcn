"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rc-print-btn inline-flex items-center gap-1.5 rounded-md border border-[var(--rc-line)] bg-[var(--rc-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--rc-txt2)] transition hover:border-[var(--rc-red)] hover:text-[var(--rc-red)]"
      aria-label="이 페이지를 PDF로 저장"
    >
      <Printer className="h-3.5 w-3.5" />
      PDF로 저장
    </button>
  );
}
