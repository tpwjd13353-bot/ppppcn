"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MenuMatch } from "@/lib/types/scoring";

interface Props {
  matches: MenuMatch[];
  initialVisible?: number;
}

function scoreClass(score: number): string {
  if (score >= 90) return "text-[var(--rc-green)]";
  if (score >= 60) return "text-[var(--rc-amber)]";
  return "text-[var(--rc-red)]";
}

// 정렬 규칙: (1) 매칭된 메뉴가 위, (2) 매칭 안에서 점수 높은 순, (3) 그 다음이 매칭 안 됨(정보 부족)
function sortMatches(list: MenuMatch[]): MenuMatch[] {
  return [...list].sort((a, b) => {
    if (a.matched !== b.matched) return a.matched ? -1 : 1;
    const sa = a.score ?? -1;
    const sb = b.score ?? -1;
    return sb - sa;
  });
}

export function MenuTable({ matches, initialVisible = 10 }: Props) {
  const [open, setOpen] = useState(false);
  const sorted = useMemo(() => sortMatches(matches), [matches]);
  const head = sorted.slice(0, initialVisible);
  const rest = sorted.slice(initialVisible);
  const visible = open ? sorted : head;

  return (
    <div className="mt-5 overflow-hidden rounded-[18px] border border-[var(--rc-lineS)] bg-[var(--rc-surface)]">
      <table className="w-full">
        <thead>
          <tr className="text-left text-[12px] text-[var(--rc-txt3)]">
            <th className="px-7 py-3.5 font-normal border-b border-[var(--rc-lineS)]">
              네이버 메뉴
            </th>
            <th className="px-7 py-3.5 font-normal border-b border-[var(--rc-lineS)] rc-hide-mobile">
              DB 매칭
            </th>
            <th className="px-7 py-3.5 text-right font-normal border-b border-[var(--rc-lineS)]">
              점수
            </th>
            <th className="px-7 py-3.5 text-right font-normal border-b border-[var(--rc-lineS)]">
              분류
            </th>
          </tr>
        </thead>
        <tbody>
          {visible.map((m, i) => (
            <tr
              key={i}
              className="border-b border-[var(--rc-lineS)] last:border-b-0 text-[14px]"
            >
              <td className="px-7 py-4 font-medium">{m.input}</td>
              <td
                className={`px-7 py-4 rc-hide-mobile ${
                  m.matched ? "text-[var(--rc-txt2)]" : "text-[var(--rc-txt3)]"
                }`}
              >
                {m.matched ? m.menuName : "—"}
              </td>
              <td className="px-7 py-4 text-right">
                {m.matched ? (
                  <span className={`font-bold ${scoreClass(m.score ?? 0)}`}>
                    {m.score}
                  </span>
                ) : (
                  <span className="text-[var(--rc-txt3)]">?</span>
                )}
              </td>
              <td
                className={`px-7 py-4 text-right text-[13px] ${
                  m.matched ? "text-[var(--rc-txt2)]" : "text-[var(--rc-txt3)]"
                }`}
              >
                {m.matched ? m.분류 : "정보 부족"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-center gap-2 border-t border-[var(--rc-lineS)] py-4 text-[14px] text-[var(--rc-txt2)] transition-colors hover:text-[var(--rc-txt)]"
        >
          {open ? "접기" : `정보 부족 메뉴 등 ${rest.length}개 더 보기`}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
