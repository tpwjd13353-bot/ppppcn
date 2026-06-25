"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Lock, LogOut, Download, Inbox, FileText, Users as UsersIcon, Sparkles, KeyRound } from "lucide-react";
import {
  GRADIENT_PRESETS,
  PLATFORM_OPTIONS,
  cleanUrl,
  type MediaType,
  type ShowcaseCard,
  type ShowcaseData,
} from "@/lib/showcase";
import { loadAuth, saveAuth, clearAuth } from "@/lib/admin-auth";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";
const labelCls = "block text-xs text-muted-foreground mb-1";

function newCard(): ShowcaseCard {
  return {
    id: `c${Date.now()}`,
    platform: PLATFORM_OPTIONS[0],
    title: "새 카드 제목",
    author: "@author",
    likes: "0",
    mediaType: "gradient",
    mediaUrl: "",
    gradient: GRADIENT_PRESETS[0],
    linkUrl: "",
  };
}

function CardThumb({ c, colorIndex }: { c: ShowcaseCard; colorIndex: number }) {
  const autoGradient = GRADIENT_PRESETS[colorIndex % GRADIENT_PRESETS.length];
  return (
    <div className="relative h-32 w-20 shrink-0 overflow-hidden rounded-lg border border-border/40">
      {c.mediaType === "video" && c.mediaUrl ? (
        <video src={c.mediaUrl} muted loop autoPlay playsInline className="h-full w-full object-cover" />
      ) : c.mediaType === "image" && c.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.mediaUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={`h-full w-full bg-gradient-to-br ${autoGradient}`} />
      )}
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [cards, setCards] = useState<ShowcaseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [fetchingId, setFetchingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadAuth();
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/showcase")
      .then((r) => r.json())
      .then((data: ShowcaseData) => setCards(data.cards ?? []))
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

  function logout() {
    clearAuth();
    setAuthed(false);
    setPassword("");
  }

  function update(id: string, patch: Partial<ShowcaseCard>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function remove(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  async function fetchPreview(cardId: string, url: string) {
    const target = cleanUrl(url);
    if (!target.startsWith("http")) {
      alert("먼저 샤오홍슈/틱톡 주소(https://…)를 넣어주세요.");
      return;
    }
    if (fetchingId) return; // 중복 호출 방지
    setFetchingId(cardId);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ url: target }),
      });
      const data = await res.json();
      if (data.ok) {
        const patch: Partial<ShowcaseCard> = { linkUrl: target };
        if (data.savedPath) {
          patch.mediaType = "image";
          patch.mediaUrl = data.savedPath;
        } else if (data.imageUrl) {
          patch.mediaType = "image";
          patch.mediaUrl = data.imageUrl;
        }
        if (data.title) patch.title = data.title;
        if (data.author) patch.author = data.author;
        update(cardId, patch);
        if (!data.savedPath && !data.imageUrl) {
          alert("제목은 가져왔지만 썸네일은 못 가져왔어요. 사진을 직접 넣어주세요.");
        }
      } else {
        alert("미리보기를 못 가져왔어요. 링크를 확인하거나 사진을 직접 넣어주세요.");
      }
    } catch {
      alert("오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setFetchingId(null);
    }
  }

  function move(idx: number, dir: -1 | 1) {
    setCards((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setSavedMsg("");
    const res = await fetch("/api/showcase", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ cards }),
    });
    setSaving(false);
    if (res.ok) {
      setSavedMsg("저장됐습니다. 홈 새로고침하면 반영돼요.");
      setTimeout(() => setSavedMsg(""), 4000);
    } else if (res.status === 401) {
      setSavedMsg("⚠ 비밀번호 오류로 저장 실패. 다시 로그인하세요.");
    } else {
      setSavedMsg("⚠ 저장 실패. 잠시 후 다시 시도하세요.");
    }
  }

  // 비번 게이트
  if (!authed) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl tracking-tight">ADMIN</h1>
          </div>
          <label className={labelCls}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="관리자 비밀번호"
            autoFocus
          />
          {authError && (
            <p className="mt-2 text-xs text-primary">{authError}</p>
          )}
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
        {/* 헤더 */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">쇼케이스 카드 관리</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              메인 페이지의 흐르는 카드들을 여기서 편집합니다. 편집 후 꼭 저장을 누르세요.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/proposal"
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" />
              제안서 생성
            </a>
            <a
              href="/admin/columns"
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              칼럼 관리
            </a>
            <a
              href="/admin/inquiries"
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <Inbox className="h-4 w-4" />
              상담 신청 내역
            </a>
            <a
              href="/admin/users"
              className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <UsersIcon className="h-4 w-4" />
              회원 관리
            </a>
            <a
              href="/account/password"
              className="inline-flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <KeyRound className="h-4 w-4" />
              비밀번호 변경
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        ) : (
          <div className="space-y-5">
            {cards.map((c, idx) => (
              <div
                key={c.id}
                className="flex gap-5 rounded-xl border border-border/40 bg-background p-5"
              >
                <CardThumb c={c} colorIndex={idx} />

                <div className="grid flex-1 grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>플랫폼</label>
                    <select
                      value={c.platform}
                      onChange={(e) => update(c.id, { platform: e.target.value })}
                      className={inputCls}
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>좋아요 수</label>
                    <input
                      value={c.likes}
                      onChange={(e) => update(c.id, { likes: e.target.value })}
                      className={inputCls}
                      placeholder="2.4万"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls}>제목</label>
                    <input
                      value={c.title}
                      onChange={(e) => update(c.id, { title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>작성자</label>
                    <input
                      value={c.author}
                      onChange={(e) => update(c.id, { author: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>미디어 종류</label>
                    <select
                      value={c.mediaType}
                      onChange={(e) =>
                        update(c.id, { mediaType: e.target.value as MediaType })
                      }
                      className={inputCls}
                    >
                      <option value="gradient">그라데이션 (기본)</option>
                      <option value="image">사진 (URL)</option>
                      <option value="video">영상 (URL)</option>
                    </select>
                  </div>

                  {c.mediaType === "gradient" ? (
                    <div className="col-span-2 rounded-md border border-dashed border-border/40 px-3 py-2">
                      <p className="text-[11px] text-muted-foreground/70">
                        🌈 그라데이션 색상은 카드 순서에 따라 자동으로 예쁘게 배정됩니다 (무지개 로테이션). 색을 직접 고를 필요 없어요.
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-2">
                      <label className={labelCls}>
                        {c.mediaType === "video" ? "영상 URL (.mp4)" : "사진 URL (.jpg/.png)"}
                      </label>
                      <input
                        value={c.mediaUrl}
                        onChange={(e) => update(c.id, { mediaUrl: e.target.value })}
                        className={inputCls}
                        placeholder="https://… 또는 /showcase/파일명"
                      />
                    </div>
                  )}

                  <div className="col-span-2">
                    <label className={labelCls}>
                      클릭 시 이동할 링크 (선택 — 샤오홍슈/틱톡 게시물 등)
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={c.linkUrl ?? ""}
                        onChange={(e) => update(c.id, { linkUrl: e.target.value })}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pasted = cleanUrl(e.clipboardData.getData("text"));
                          update(c.id, { linkUrl: pasted });
                          if (pasted.startsWith("http")) {
                            fetchPreview(c.id, pasted);
                          }
                        }}
                        className={inputCls}
                        placeholder="여기에 URL 붙여넣으면 자동으로 가져옵니다"
                      />
                      <button
                        type="button"
                        onClick={() => fetchPreview(c.id, c.linkUrl ?? "")}
                        disabled={fetchingId === c.id}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/50 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {fetchingId === c.id ? "가져오는 중…" : "다시 가져오기"}
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground/60">
                      URL을 붙여넣는 순간 제목·썸네일이 자동으로 채워집니다. (제목은 중국어 원문)
                    </p>
                  </div>
                </div>

                {/* 액션 */}
                <div className="flex flex-col items-center gap-2">
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
                    onClick={() => remove(c.id)}
                    className="mt-auto rounded-md border border-border/50 p-1.5 text-muted-foreground transition hover:border-destructive hover:text-destructive"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => setCards((prev) => [...prev, newCard()])}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border/50 py-6 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              카드 추가
            </button>
          </div>
        )}
      </div>

      {/* 하단 고정 저장 바 */}
      <div className="sticky bottom-0 mt-10 border-t border-border/40 bg-background/90 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            {savedMsg || `카드 ${cards.length}개`}
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
