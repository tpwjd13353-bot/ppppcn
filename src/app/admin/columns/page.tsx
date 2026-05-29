"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import type { Column, ColumnData } from "@/lib/column";
import { loadAuth, saveAuth } from "@/lib/admin-auth";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";
const labelCls = "mb-1 block text-xs text-muted-foreground";

function newColumn(): Column {
  return {
    id: `col-${Date.now()}`,
    title: "새 칼럼 제목",
    summary: "",
    thumbnail: "",
    body: "",
    date: new Date().toISOString().slice(0, 10),
  };
}

export default function AdminColumnsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadAuth();
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/columns")
      .then((r) => r.json())
      .then((d: ColumnData) => setColumns(d.columns ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authed]);

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

  function update(id: string, patch: Partial<Column>) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function remove(id: string) {
    if (!confirm("이 칼럼을 삭제할까요?")) return;
    setColumns((prev) => prev.filter((c) => c.id !== id));
  }

  function move(idx: number, dir: -1 | 1) {
    setColumns((prev) => {
      const next = [...prev];
      const t = idx + dir;
      if (t < 0 || t >= next.length) return prev;
      [next[idx], next[t]] = [next[t], next[idx]];
      return next;
    });
  }

  async function uploadImage(id: string, file: File) {
    setUploadingId(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: fd,
      });
      const data = await res.json();
      if (data.ok && data.url) {
        update(id, { thumbnail: data.url });
      } else {
        alert("이미지 업로드에 실패했어요.");
      }
    } catch {
      alert("업로드 중 오류가 발생했어요.");
    } finally {
      setUploadingId(null);
    }
  }

  async function uploadImages(id: string, files: FileList) {
    setUploadingId(id);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-admin-password": password },
          body: fd,
        });
        const data = await res.json();
        if (data.ok && data.url) urls.push(data.url);
      }
      if (urls.length) {
        setColumns((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, images: [...(c.images ?? []), ...urls] } : c,
          ),
        );
      }
    } catch {
      alert("이미지 업로드 중 오류가 발생했어요.");
    } finally {
      setUploadingId(null);
    }
  }

  function removeImage(id: string, idx: number) {
    setColumns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, images: (c.images ?? []).filter((_, i) => i !== idx) }
          : c,
      ),
    );
  }

  async function save() {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch("/api/columns", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ columns }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedMsg("저장됐습니다. 홈/칼럼 페이지 새로고침하면 반영돼요.");
      setTimeout(() => setSavedMsg(""), 4000);
    } else {
      setSavedMsg("⚠ 저장 실패. 다시 로그인하거나 잠시 후 시도하세요.");
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">칼럼 관리</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              칼럼을 작성·수정·삭제합니다. 편집 후 꼭 저장을 누르세요. (총 {columns.length}개)
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
        ) : (
          <div className="space-y-6">
            {columns.map((col, idx) => (
              <div
                key={col.id}
                className="rounded-xl border border-border/40 bg-background p-6"
              >
                <div className="flex gap-5">
                  {/* 썸네일 */}
                  <div className="shrink-0">
                    <div className="relative h-32 w-24 overflow-hidden rounded-lg border border-border/40 bg-muted/10">
                      {col.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={col.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground/40">
                          대표사진
                        </span>
                      )}
                    </div>
                    <label className="mt-2 flex cursor-pointer items-center justify-center gap-1 rounded-md border border-primary/50 px-2 py-1.5 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                      <Upload className="h-3 w-3" />
                      {uploadingId === col.id ? "올리는 중…" : "사진 업로드"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadImage(col.id, f);
                        }}
                      />
                    </label>
                  </div>

                  {/* 본문 필드 */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className={labelCls}>제목</label>
                        <input
                          value={col.title}
                          onChange={(e) => update(col.id, { title: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>날짜</label>
                        <input
                          type="date"
                          value={col.date}
                          onChange={(e) => update(col.id, { date: e.target.value })}
                          className={inputCls}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>요약 (카드에 보일 짧은 설명)</label>
                      <input
                        value={col.summary}
                        onChange={(e) => update(col.id, { summary: e.target.value })}
                        className={inputCls}
                        placeholder="한두 문장으로 요약"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>본문</label>
                      <textarea
                        value={col.body}
                        onChange={(e) => update(col.id, { body: e.target.value })}
                        className={`${inputCls} min-h-[180px] resize-y`}
                        placeholder="칼럼 본문을 작성하세요. 줄바꿈은 그대로 반영됩니다."
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        본문 이미지 (눌렀을 때 세로로 표시 · 여러 장 가능)
                      </label>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {(col.images ?? []).map((img, i) => (
                          <div
                            key={i}
                            className="group relative aspect-[3/4] overflow-hidden rounded-md border border-border/40"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(col.id, i)}
                              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                              title="삭제"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        <label className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border/50 text-[10px] text-muted-foreground transition hover:border-primary hover:text-primary">
                          <Plus className="h-4 w-4" />
                          {uploadingId === col.id ? "올리는중" : "추가"}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.length)
                                uploadImages(col.id, e.target.files);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => move(idx, -1)}
                        className="rounded-md border border-border/50 p-1.5 text-muted-foreground transition hover:border-primary hover:text-primary"
                        title="위로"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => move(idx, 1)}
                        className="rounded-md border border-border/50 p-1.5 text-muted-foreground transition hover:border-primary hover:text-primary"
                        title="아래로"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(col.id)}
                        className="rounded-md border border-border/50 p-1.5 text-muted-foreground transition hover:border-destructive hover:text-destructive"
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => setColumns((prev) => [newColumn(), ...prev])}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 py-6 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              새 칼럼 추가
            </button>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 mt-10 border-t border-border/40 bg-background/90 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {savedMsg || `칼럼 ${columns.length}개`}
          </span>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </main>
  );
}
