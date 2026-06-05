"use client";

// 어드민 — 중국 마케팅 제안서 생성·편집·PDF 내보내기.

import { useMemo, useState } from "react";
import { Download, FileText, Loader2, Search, Sparkles, ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { NaverPlaceData } from "@/lib/analyze/naver";
import type { ProposalData } from "@/lib/proposal/types";

const inputCls =
  "w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";
const textareaCls =
  "w-full rounded-md border border-border/50 bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none resize-y";
const labelCls = "block text-xs text-muted-foreground mb-1";

export function ProposalGenerator() {
  const [url, setUrl] = useState("");
  const [place, setPlace] = useState<NaverPlaceData | null>(null);
  const [data, setData] = useState<ProposalData | null>(null);
  const [contact, setContact] = useState({
    name: "김세정 본부장",
    title: "퍼플페퍼 (PURPLEPEPPER co., Ltd.)",
    phone: "010-2991-5990",
    email: "sejeong13@pppp.team",
  });
  const [useWebSearch, setUseWebSearch] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [webUsed, setWebUsed] = useState<boolean | null>(null);

  async function handleFetch() {
    if (!url.trim()) {
      setErr("URL을 입력해주세요.");
      return;
    }
    setErr(null);
    setHint(null);
    setFetching(true);
    setPlace(null);
    setData(null);
    try {
      const res = await fetch("/api/admin/proposal/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const j = await res.json();
      if (!j.ok) {
        setErr(j.error ?? "수집에 실패했어요.");
        if (j.hint) setHint(j.hint);
        return;
      }
      setPlace(j.place);
    } catch {
      setErr("네트워크 오류가 발생했어요.");
    } finally {
      setFetching(false);
    }
  }

  async function handleGenerate() {
    if (!place) return;
    setErr(null);
    setHint(null);
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/proposal/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place, useWebSearch }),
      });
      const j = await res.json();
      if (!j.ok) {
        setErr(j.error ?? "생성에 실패했어요.");
        if (j.hint) setHint(j.hint);
        return;
      }
      setData(j.data as ProposalData);
      setWebUsed(j.webUsed);
    } catch {
      setErr("네트워크 오류가 발생했어요.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleDownloadPdf() {
    if (!data) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/admin/proposal/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          contactName: contact.name || undefined,
          contactTitle: contact.title || undefined,
          contactPhone: contact.phone || undefined,
          contactEmail: contact.email || undefined,
          fileName: `${data.meta.clientName || "proposal"}-china-marketing-proposal`,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error ?? "PDF 생성에 실패했어요.");
        return;
      }
      const blob = await res.blob();
      const dl = document.createElement("a");
      const objUrl = URL.createObjectURL(blob);
      dl.href = objUrl;
      const cd = res.headers.get("Content-Disposition") ?? "";
      const fnMatch = cd.match(/filename\*=UTF-8''([^;]+)/);
      dl.download = fnMatch ? decodeURIComponent(fnMatch[1]) : "proposal.pdf";
      document.body.appendChild(dl);
      dl.click();
      dl.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      setErr("PDF 다운로드 중 오류가 발생했어요.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="flex-1 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* 헤더 */}
        <div className="mb-10">
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            어드민 홈
          </a>
          <h1 className="mt-3 font-heading text-3xl font-bold">중국 마케팅 제안서 생성</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            네이버 플레이스 URL을 입력하면 매장 정보를 수집하고 LLM이 제안서 초안을 작성합니다. 섹션별로 편집한 뒤 PDF로 내보낼 수 있습니다.
          </p>
        </div>

        {/* STEP 1 — URL 입력 */}
        <section className="mb-8 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur md:p-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="rounded-full bg-primary/10 px-2 py-0.5">STEP 1</span>
            <span>매장 정보 수집</span>
          </div>
          <label className={labelCls}>네이버 플레이스 URL</label>
          <div className="flex flex-col gap-2 md:flex-row">
            <input
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={fetching}
              className={inputCls}
              placeholder="https://naver.me/...  또는  https://map.naver.com/p/entry/place/..."
            />
            <button
              type="button"
              onClick={handleFetch}
              disabled={fetching}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {fetching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  수집 중…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  정보 가져오기
                </>
              )}
            </button>
          </div>
          {place && (
            <div className="mt-4 rounded-md border border-border/40 bg-background/40 p-3 text-xs">
              <p>
                <b className="text-foreground/80">{place.name}</b>{" "}
                <span className="text-muted-foreground">· {place.category || "—"}</span>
              </p>
              <p className="mt-1 text-muted-foreground">
                {place.roadAddress || place.address || "주소 정보 없음"}
              </p>
              {place.menus.length > 0 && (
                <p className="mt-1 text-muted-foreground">
                  메뉴 {place.menus.length}개: {place.menus.slice(0, 6).join(" · ")}
                  {place.menus.length > 6 && " …"}
                </p>
              )}
              {place.partial && (
                <p className="mt-1 text-warning">⚠ 일부 정보가 비어있을 수 있어요.</p>
              )}
            </div>
          )}
        </section>

        {/* STEP 2 — 제안서 생성 */}
        {place && (
          <section className="mb-8 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur md:p-8">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
              <span className="rounded-full bg-primary/10 px-2 py-0.5">STEP 2</span>
              <span>LLM 제안서 생성</span>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useWebSearch}
                  onChange={(e) => setUseWebSearch(e.target.checked)}
                  className="h-4 w-4 rounded border-border/50"
                />
                상호명 웹 검색으로 브랜드 서사·방송 출연·해외배송 여부 보강 (Responses API + web_search)
              </label>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    생성 중… (20~60초)
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {data ? "다시 생성" : "제안서 생성"}
                  </>
                )}
              </button>
            </div>
            {webUsed !== null && data && (
              <p className="mt-2 text-xs text-muted-foreground">
                {webUsed ? "✓ 웹 검색으로 보강됨" : "ℹ 웹 검색 미사용 (수집 정보 기반)"}
              </p>
            )}
          </section>
        )}

        {/* 에러 */}
        {err && (
          <div className="mb-8 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <p className="font-medium text-destructive">{err}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          </div>
        )}

        {/* STEP 3 — 편집 + 내보내기 */}
        {data && (
          <ProposalEditor
            data={data}
            onChange={setData}
            contact={contact}
            onContactChange={setContact}
            onDownload={handleDownloadPdf}
            downloading={downloading}
          />
        )}
      </div>
    </main>
  );
}

// ──────────────── 에디터 ────────────────

function ProposalEditor({
  data,
  onChange,
  contact,
  onContactChange,
  onDownload,
  downloading,
}: {
  data: ProposalData;
  onChange: (d: ProposalData) => void;
  contact: { name: string; title: string; phone: string; email: string };
  onContactChange: (c: { name: string; title: string; phone: string; email: string }) => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  // helper: 패치형 setter
  function patch<K extends keyof ProposalData>(key: K, value: ProposalData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <>
      <section className="space-y-8 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur md:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span className="rounded-full bg-primary/10 px-2 py-0.5">STEP 3</span>
          <span>섹션별 편집 (인라인)</span>
        </div>

        {/* 표지 */}
        <SectionBlock title="표지" desc="제안서 메인 타이틀과 머리글">
          <div className="grid gap-3">
            <Field label="메인 타이틀 (줄바꿈 가능)">
              <textarea
                rows={3}
                value={data.cover.title}
                onChange={(e) => patch("cover", { ...data.cover, title: e.target.value })}
                className={textareaCls}
              />
            </Field>
            <Field label="FOR. 라인 (수신처)">
              <input
                value={data.cover.forLine}
                onChange={(e) => patch("cover", { ...data.cover, forLine: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="서브라인 (클라이언트·발행일·대행사)">
              <input
                value={data.cover.subline}
                onChange={(e) => patch("cover", { ...data.cover, subline: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="클라이언트명 (PDF 푸터에 사용)">
                <input
                  value={data.meta.clientName}
                  onChange={(e) => patch("meta", { ...data.meta, clientName: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="발행일 ISO (YYYY-MM-DD)">
                <input
                  value={data.meta.issuedAtIso}
                  onChange={(e) => patch("meta", { ...data.meta, issuedAtIso: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </SectionBlock>

        {/* 1. 현황 진단 */}
        <SectionBlock title="1. 현황 진단" desc="강점·현 상태·핵심 통증·경쟁사 한계 + 결론 + 채널 데이터">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="강점">
              <textarea
                rows={4}
                value={data.diagnosis.strength}
                onChange={(e) => patch("diagnosis", { ...data.diagnosis, strength: e.target.value })}
                className={textareaCls}
              />
            </Field>
            <Field label="현 상태">
              <textarea
                rows={4}
                value={data.diagnosis.current}
                onChange={(e) => patch("diagnosis", { ...data.diagnosis, current: e.target.value })}
                className={textareaCls}
              />
            </Field>
            <Field label="핵심 통증">
              <textarea
                rows={4}
                value={data.diagnosis.pain}
                onChange={(e) => patch("diagnosis", { ...data.diagnosis, pain: e.target.value })}
                className={textareaCls}
              />
            </Field>
            <Field label="경쟁사 한계">
              <textarea
                rows={4}
                value={data.diagnosis.competitor}
                onChange={(e) => patch("diagnosis", { ...data.diagnosis, competitor: e.target.value })}
                className={textareaCls}
              />
            </Field>
          </div>
          <div className="mt-3 grid gap-3">
            <Field label="결론 헤드라인 (한 줄)">
              <input
                value={data.diagnosis.conclusionHeadline}
                onChange={(e) =>
                  patch("diagnosis", { ...data.diagnosis, conclusionHeadline: e.target.value })
                }
                className={inputCls}
              />
            </Field>
            <Field label="결론 본문 (4~5줄)">
              <textarea
                rows={4}
                value={data.diagnosis.conclusionBody}
                onChange={(e) =>
                  patch("diagnosis", { ...data.diagnosis, conclusionBody: e.target.value })
                }
                className={textareaCls}
              />
            </Field>
          </div>
          <div className="mt-3">
            <p className={labelCls}>왜 이 채널인가 — 데이터카드 3개</p>
            <div className="grid gap-3 md:grid-cols-3">
              {data.diagnosis.whyChannel.map((c, i) => (
                <div key={i} className="rounded-md border border-border/40 p-3">
                  <Field label={`#${i + 1} BIG`}>
                    <input
                      value={c.big}
                      onChange={(e) => {
                        const next = [...data.diagnosis.whyChannel];
                        next[i] = { ...next[i], big: e.target.value };
                        patch("diagnosis", { ...data.diagnosis, whyChannel: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="라벨">
                    <input
                      value={c.label}
                      onChange={(e) => {
                        const next = [...data.diagnosis.whyChannel];
                        next[i] = { ...next[i], label: e.target.value };
                        patch("diagnosis", { ...data.diagnosis, whyChannel: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="부연">
                    <input
                      value={c.note}
                      onChange={(e) => {
                        const next = [...data.diagnosis.whyChannel];
                        next[i] = { ...next[i], note: e.target.value };
                        patch("diagnosis", { ...data.diagnosis, whyChannel: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>

        {/* 2. 단계 전략 (표) */}
        <SectionBlock title="2. 단계 전략 개요 (표)" desc="Phase 1/2 목표·채널 + 원칙">
          <div className="overflow-hidden rounded-md border border-border/40">
            <div className="grid grid-cols-[1.2fr_2.5fr_2fr] bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
              <span>구분</span>
              <span>목표</span>
              <span>주요 채널</span>
            </div>
            <div className="grid grid-cols-[1.2fr_2.5fr_2fr] items-start gap-2 border-t border-border/40 p-3">
              <div className="text-sm font-semibold">
                Phase 1 <span className="block text-xs font-normal text-muted-foreground">0–3개월</span>
              </div>
              <textarea
                rows={2}
                value={data.phaseStrategy.phase1Goal}
                onChange={(e) =>
                  patch("phaseStrategy", { ...data.phaseStrategy, phase1Goal: e.target.value })
                }
                className={textareaCls}
              />
              <textarea
                rows={2}
                value={data.phaseStrategy.phase1Channel}
                onChange={(e) =>
                  patch("phaseStrategy", { ...data.phaseStrategy, phase1Channel: e.target.value })
                }
                className={textareaCls}
              />
            </div>
            <div className="grid grid-cols-[1.2fr_2.5fr_2fr] items-start gap-2 border-t border-border/40 p-3">
              <div className="text-sm font-semibold">
                Phase 2 <span className="block text-xs font-normal text-muted-foreground">3–6개월</span>
              </div>
              <textarea
                rows={2}
                value={data.phaseStrategy.phase2Goal}
                onChange={(e) =>
                  patch("phaseStrategy", { ...data.phaseStrategy, phase2Goal: e.target.value })
                }
                className={textareaCls}
              />
              <textarea
                rows={2}
                value={data.phaseStrategy.phase2Channel}
                onChange={(e) =>
                  patch("phaseStrategy", { ...data.phaseStrategy, phase2Channel: e.target.value })
                }
                className={textareaCls}
              />
            </div>
          </div>
          <Field label="표 아래 원칙">
            <textarea
              rows={2}
              value={data.phaseStrategy.principle}
              onChange={(e) =>
                patch("phaseStrategy", { ...data.phaseStrategy, principle: e.target.value })
              }
              className={textareaCls}
            />
          </Field>
        </SectionBlock>

        {/* 3. Phase 1 */}
        <SectionBlock title="3. Phase 1 — 매장 전환" desc="따종디엔핑·KOC·KPI·타임라인">
          <BulletList
            label="① 따종디엔핑 매장 최적화 — 불릿"
            items={data.phase1.dianpingBullets}
            onChange={(items) => patch("phase1", { ...data.phase1, dianpingBullets: items })}
          />
          <BulletList
            label="② 샤오홍슈 KOC 시딩 — 불릿"
            items={data.phase1.kocBullets}
            onChange={(items) => patch("phase1", { ...data.phase1, kocBullets: items })}
          />
          <BulletList
            label="Phase 1 KPI (마지막 항목은 PDF에서 빨간색으로 자동 표시)"
            items={data.phase1.kpiBullets}
            onChange={(items) => patch("phase1", { ...data.phase1, kpiBullets: items })}
          />
          <div className="mt-3">
            <p className={labelCls}>액션 타임라인 (3단계)</p>
            <div className="grid gap-3 md:grid-cols-3">
              {data.phase1.timeline.map((t, i) => (
                <div key={i} className="rounded-md border border-border/40 p-3">
                  <Field label="시기">
                    <input
                      value={t.month}
                      onChange={(e) => {
                        const next = [...data.phase1.timeline];
                        next[i] = { ...next[i], month: e.target.value };
                        patch("phase1", { ...data.phase1, timeline: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="제목">
                    <input
                      value={t.title}
                      onChange={(e) => {
                        const next = [...data.phase1.timeline];
                        next[i] = { ...next[i], title: e.target.value };
                        patch("phase1", { ...data.phase1, timeline: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="설명">
                    <textarea
                      rows={3}
                      value={t.body}
                      onChange={(e) => {
                        const next = [...data.phase1.timeline];
                        next[i] = { ...next[i], body: e.target.value };
                        patch("phase1", { ...data.phase1, timeline: next });
                      }}
                      className={textareaCls}
                    />
                  </Field>
                </div>
              ))}
            </div>
          </div>
        </SectionBlock>

        {/* 4. Phase 2 */}
        <SectionBlock title="4. Phase 2 — 브랜드 자산화" desc="공식 계정 운영 원칙 + KPI">
          <Field label="인트로 (3~4줄)">
            <textarea
              rows={4}
              value={data.phase2.intro}
              onChange={(e) => patch("phase2", { ...data.phase2, intro: e.target.value })}
              className={textareaCls}
            />
          </Field>
          <BulletList
            label="원칙 불릿"
            items={data.phase2.bullets}
            onChange={(items) => patch("phase2", { ...data.phase2, bullets: items })}
          />
          <BulletList
            label="Phase 2 KPI"
            items={data.phase2.kpiBullets}
            onChange={(items) => patch("phase2", { ...data.phase2, kpiBullets: items })}
          />
        </SectionBlock>

        {/* 5. 콘텐츠 방향성 */}
        <SectionBlock title="5. 콘텐츠 방향성" desc="4축 + 공통 가이드 + 차별화 비교">
          <Field label="인트로 (한 줄)">
            <textarea
              rows={2}
              value={data.content.intro}
              onChange={(e) => patch("content", { ...data.content, intro: e.target.value })}
              className={textareaCls}
            />
          </Field>
          <p className={labelCls}>4축</p>
          <div className="grid gap-3 md:grid-cols-2">
            {data.content.axes.map((a, i) => (
              <div key={i} className="rounded-md border border-border/40 p-3">
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <Field label="비중">
                    <input
                      value={a.pct}
                      onChange={(e) => {
                        const next = [...data.content.axes];
                        next[i] = { ...next[i], pct: e.target.value };
                        patch("content", { ...data.content, axes: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="라벨">
                    <input
                      value={a.label}
                      onChange={(e) => {
                        const next = [...data.content.axes];
                        next[i] = { ...next[i], label: e.target.value };
                        patch("content", { ...data.content, axes: next });
                      }}
                      className={inputCls}
                    />
                  </Field>
                </div>
                <Field label="본문">
                  <textarea
                    rows={3}
                    value={a.body}
                    onChange={(e) => {
                      const next = [...data.content.axes];
                      next[i] = { ...next[i], body: e.target.value };
                      patch("content", { ...data.content, axes: next });
                    }}
                    className={textareaCls}
                  />
                </Field>
              </div>
            ))}
          </div>
          <BulletList
            label="공통 가이드"
            items={data.content.commonGuide}
            onChange={(items) => patch("content", { ...data.content, commonGuide: items })}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border/40 p-3">
              <Field label="비교 — 좌측 라벨">
                <input
                  value={data.content.compareLeftLabel}
                  onChange={(e) => patch("content", { ...data.content, compareLeftLabel: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <BulletList
                label="좌측 항목"
                items={data.content.compareLeft}
                onChange={(items) => patch("content", { ...data.content, compareLeft: items })}
              />
            </div>
            <div className="rounded-md border border-border/40 p-3">
              <Field label="비교 — 우측 라벨">
                <input
                  value={data.content.compareRightLabel}
                  onChange={(e) => patch("content", { ...data.content, compareRightLabel: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <BulletList
                label="우측 항목"
                items={data.content.compareRight}
                onChange={(items) => patch("content", { ...data.content, compareRight: items })}
              />
            </div>
          </div>
        </SectionBlock>

        {/* 6. 예산 (표) */}
        <SectionBlock title="6. 예산 · 운영 구조 (표)" desc="항목·단가/구성·청구 금액">
          <div className="overflow-hidden rounded-md border border-border/40">
            <div className="grid grid-cols-[2.5fr_2fr_1.4fr_60px] bg-primary/5 px-3 py-2 text-xs font-semibold text-primary">
              <span>항목</span>
              <span>단가 / 구성</span>
              <span className="text-right">청구 금액</span>
              <span />
            </div>
            {data.budget.rows.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-[2.5fr_2fr_1.4fr_60px] items-start gap-2 border-t border-border/40 p-3"
              >
                <div className="space-y-1">
                  <input
                    value={r.label}
                    placeholder="항목명"
                    onChange={(e) => {
                      const next = [...data.budget.rows];
                      next[i] = { ...next[i], label: e.target.value };
                      patch("budget", { ...data.budget, rows: next });
                    }}
                    className={inputCls}
                  />
                  <input
                    value={r.sub}
                    placeholder="부연"
                    onChange={(e) => {
                      const next = [...data.budget.rows];
                      next[i] = { ...next[i], sub: e.target.value };
                      patch("budget", { ...data.budget, rows: next });
                    }}
                    className={inputCls}
                  />
                </div>
                <textarea
                  rows={2}
                  value={r.unit}
                  onChange={(e) => {
                    const next = [...data.budget.rows];
                    next[i] = { ...next[i], unit: e.target.value };
                    patch("budget", { ...data.budget, rows: next });
                  }}
                  className={textareaCls}
                />
                <input
                  value={r.amount}
                  onChange={(e) => {
                    const next = [...data.budget.rows];
                    next[i] = { ...next[i], amount: e.target.value };
                    patch("budget", { ...data.budget, rows: next });
                  }}
                  className={`${inputCls} text-right`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = data.budget.rows.filter((_, idx) => idx !== i);
                    patch("budget", { ...data.budget, rows: next });
                  }}
                  className="self-center rounded-md p-1.5 text-muted-foreground transition hover:text-destructive"
                  title="행 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() =>
                patch("budget", {
                  ...data.budget,
                  rows: [...data.budget.rows, { label: "", sub: "", unit: "", amount: "" }],
                })
              }
              className="inline-flex items-center gap-1.5 rounded-md border border-border/50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              행 추가
            </button>
          </div>
          <Field label="표 아래 주석">
            <textarea
              rows={2}
              value={data.budget.note}
              onChange={(e) => patch("budget", { ...data.budget, note: e.target.value })}
              className={textareaCls}
            />
          </Field>
        </SectionBlock>

        {/* 7. 기대 효과 */}
        <SectionBlock title="7. 기대 효과 및 전제" desc="좌측 기대 가능 · 우측 전제 조건">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="기대 가능">
              <textarea
                rows={5}
                value={data.expectation.canExpect}
                onChange={(e) =>
                  patch("expectation", { ...data.expectation, canExpect: e.target.value })
                }
                className={textareaCls}
              />
            </Field>
            <Field label="전제 조건">
              <textarea
                rows={5}
                value={data.expectation.premise}
                onChange={(e) =>
                  patch("expectation", { ...data.expectation, premise: e.target.value })
                }
                className={textareaCls}
              />
            </Field>
          </div>
        </SectionBlock>

        {/* 담당자 */}
        <SectionBlock title="담당자 (PDF 4페이지 하단)" desc="PDF에만 사용 — 화면에는 표기되지 않음">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="이름">
              <input
                value={contact.name}
                onChange={(e) => onContactChange({ ...contact, name: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="소속">
              <input
                value={contact.title}
                onChange={(e) => onContactChange({ ...contact, title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="전화번호">
              <input
                value={contact.phone}
                onChange={(e) => onContactChange({ ...contact, phone: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="이메일">
              <input
                value={contact.email}
                onChange={(e) => onContactChange({ ...contact, email: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionBlock>
      </section>

      {/* 하단 고정 다운로드 바 */}
      <div className="sticky bottom-0 mt-8 border-t border-border/40 bg-background/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            <FileText className="mr-1 inline-block h-4 w-4 align-text-bottom" />
            현재 편집 상태 그대로 PDF로 내보냅니다.
          </span>
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                생성 중…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                PDF로 내보내기
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ──────────────── 작은 UI 헬퍼 ────────────────

function SectionBlock({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 border-t border-border/30 pt-6 first:border-t-0 first:pt-0">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function BulletList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
}) {
  const stable = useMemo(() => items, [items]);
  return (
    <div className="mt-3">
      <p className={labelCls}>{label}</p>
      <div className="space-y-2">
        {stable.map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2 text-xs text-muted-foreground">·</span>
            <textarea
              rows={2}
              value={t}
              onChange={(e) => {
                const next = [...stable];
                next[i] = e.target.value;
                onChange(next);
              }}
              className={textareaCls}
            />
            <button
              type="button"
              onClick={() => {
                const next = stable.filter((_, idx) => idx !== i);
                onChange(next);
              }}
              className="rounded-md p-1.5 text-muted-foreground transition hover:text-destructive"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...stable, ""])}
          className="inline-flex items-center gap-1.5 rounded-md border border-border/50 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          항목 추가
        </button>
      </div>
    </div>
  );
}
