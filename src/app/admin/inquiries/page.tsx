"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ArrowLeft, Inbox } from "lucide-react";
import type { Inquiry, InquiryData } from "@/lib/inquiry";
import { loadAuth, saveAuth } from "@/lib/admin-auth";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

export default function InquiriesPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = loadAuth();
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/inquiry", { headers: { "x-admin-password": password } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: InquiryData) => setInquiries(data.inquiries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authed, password]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.ok) {
      saveAuth(password);
      setAuthed(true);
    } else {
      setAuthError("비밀번호가 틀렸습니다.");
    }
  }

  if (!authed) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl tracking-tight">ADMIN</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="관리자 비밀번호"
            autoFocus
          />
          {authError && <p className="mt-2 text-xs text-primary">{authError}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            들어가기
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Inbox className="h-6 w-6 text-primary" />
              <h1 className="font-heading text-3xl font-bold">상담 신청 내역</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              홈페이지 문의 폼으로 들어온 상담 신청 목록입니다. (총 {inquiries.length}건)
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            쇼케이스 관리로
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        ) : inquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/40 py-20 text-center text-sm text-muted-foreground">
            아직 들어온 상담 신청이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/40">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">신청일시</th>
                  <th className="px-4 py-3 font-medium">상호명</th>
                  <th className="px-4 py-3 font-medium">연락처</th>
                  <th className="px-4 py-3 font-medium">업종</th>
                  <th className="px-4 py-3 font-medium">지역</th>
                  <th className="px-4 py-3 font-medium">예산</th>
                  <th className="px-4 py-3 font-medium">내용</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-border/20 align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                      {fmtDate(q.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-semibold">{q.business}</td>
                    <td className="whitespace-nowrap px-4 py-3">{q.contact}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {q.industry || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {q.region || "-"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {q.budget || "-"}
                    </td>
                    <td className="max-w-[220px] px-4 py-3 text-muted-foreground">
                      {q.message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
