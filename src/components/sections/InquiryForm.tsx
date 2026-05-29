"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { INDUSTRY_OPTIONS, BUDGET_OPTIONS } from "@/lib/inquiry";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none";
const labelCls = "mb-2 block text-sm font-medium text-foreground/80";

type FormState = {
  business: string;
  contact: string;
  industry: string;
  region: string;
  budget: string;
  message: string;
};

const EMPTY: FormState = {
  business: "",
  contact: "",
  industry: "",
  region: "",
  budget: "",
  message: "",
};

export function InquiryForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business.trim() || !form.contact.trim()) {
      setError("상호명과 연락처는 필수입니다.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
      } else {
        setError(data.error ?? "접수에 실패했어요. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setError("오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/[0.05] p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-6 font-heading text-2xl font-bold">
          상담 신청이 접수됐습니다
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          담당자가 빠르게 연락드리겠습니다. 급하시면 아래 카카오 오픈채팅으로 바로 문의해주세요.
        </p>
        <button
          onClick={() => {
            setForm(EMPTY);
            setDone(false);
          }}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          새 상담 신청하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/40 bg-background p-8 md:p-10"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelCls}>
            상호명 <span className="text-primary">*</span>
          </label>
          <input
            value={form.business}
            onChange={(e) => set("business", e.target.value)}
            className={inputCls}
            placeholder="예) 따종훠궈 성수점"
            required
          />
        </div>
        <div>
          <label className={labelCls}>
            연락처 <span className="text-primary">*</span>
          </label>
          <input
            value={form.contact}
            onChange={(e) => set("contact", e.target.value)}
            className={inputCls}
            placeholder="예) 010-0000-0000"
            required
          />
        </div>
        <div>
          <label className={labelCls}>업종</label>
          <select
            value={form.industry}
            onChange={(e) => set("industry", e.target.value)}
            className={inputCls}
          >
            <option value="">선택 안 함</option>
            {INDUSTRY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>지역</label>
          <input
            value={form.region}
            onChange={(e) => set("region", e.target.value)}
            className={inputCls}
            placeholder="예) 서울 성수동"
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>월 예산</label>
          <select
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
            className={inputCls}
          >
            <option value="">선택 안 함</option>
            {BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>문의 내용</label>
          <textarea
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className={`${inputCls} min-h-[110px] resize-y`}
            placeholder="궁금한 점이나 매장 상황을 자유롭게 적어주세요."
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-primary">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 md:w-auto"
      >
        <Send className="h-4 w-4" />
        {submitting ? "신청 중…" : "무료 상담 신청"}
      </button>
      <p className="mt-3 text-xs text-muted-foreground/60">
        <span className="text-primary">*</span> 상호명과 연락처만 입력하면 신청됩니다. 나머지는 선택이에요.
      </p>
    </form>
  );
}
