"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, AlertCircle, Link2, Building2, ExternalLink, MapPin } from "lucide-react";

type Mode = "url" | "manual";
type Category =
  | "food"
  | "cafe"
  | "beauty"
  | "cosmetics"
  | "fashion"
  | "goods"
  | "wellness"
  | "pharmacy"
  | "spa"
  | "photo"
  | "eyewear"
  | "retail"
  | "experience"
  | "medical"
  | "other";

const CATEGORY_OPTIONS: Array<{ value: Category; label: string }> = [
  { value: "food", label: "음식점" },
  { value: "cafe", label: "카페 · 디저트" },
  { value: "beauty", label: "미용 · 헤어 · 네일" },
  { value: "cosmetics", label: "화장품 · 뷰티" },
  { value: "fashion", label: "패션 (의류 · 신발 · 가방)" },
  { value: "goods", label: "잡화 · 라이프스타일 (액세서리 · 소품 · 생활용품)" },
  { value: "wellness", label: "건강 · 웰니스 (건강기능식품 · 영양제 · 웰빙)" },
  { value: "pharmacy", label: "약국 (의약품 · 한방약 · OTC)" },
  { value: "spa", label: "마사지 · 스파 · 발마사지 · 찜질방" },
  { value: "photo", label: "사진관 · 인생네컷 · 셀프스튜디오" },
  { value: "eyewear", label: "안경 · 아이웨어" },
  { value: "retail", label: "편의점 · 소매 · 다이소형 매장" },
  { value: "experience", label: "체험 · 액티비티 (한복 · 클래스 · K-팝 등)" },
  { value: "medical", label: "의료 · 성형 · 피부과" },
  { value: "other", label: "기타" },
];

interface Props {
  tier: "guest" | "member" | "admin";
}

export function AnalyzeForm({ tier }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("url");

  // URL 모드
  const [url, setUrl] = useState("");

  // 수동 모드
  const [placeName, setPlaceName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [services, setServices] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<{ message: string; hint?: string } | null>(
    null,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "url") {
      if (!url.trim()) {
        setError({ message: "네이버 플레이스 URL을 입력해주세요." });
        return;
      }
    } else {
      if (!address.trim()) {
        setError({ message: "주소를 입력해주세요." });
        return;
      }
      if (!category) {
        setError({ message: "카테고리를 선택해주세요." });
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload =
        mode === "url"
          ? { mode: "url", url: url.trim() }
          : {
              mode: "manual",
              placeName: placeName.trim() || undefined,
              address: address.trim(),
              category,
              services: services.trim() || undefined,
            };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.ok) {
        setError({ message: data.error, hint: data.hint });
        setSubmitting(false);
        return;
      }

      router.push(`/analyze/result/${data.id}`);
    } catch {
      setError({
        message: "분석 중 오류가 발생했어요.",
        hint: "잠시 후 다시 시도해주세요.",
      });
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-border/40 bg-background/60 p-6 backdrop-blur md:p-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {tier === "admin" ? (
            <span className="text-primary">어드민: 무제한 이용</span>
          ) : (
            <span>상권 분석 무제한 · PDF 보고서는 회원 가입 후 3회</span>
          )}
        </span>
      </div>

      {/* 모드 토글 */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-border/40 bg-background/40 p-1">
        <button
          type="button"
          onClick={() => setMode("url")}
          disabled={submitting}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link2 className="h-4 w-4" />
          플레이스 URL
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          disabled={submitting}
          className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition ${
            mode === "manual"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          수기 정보 입력
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "url" ? (
          <>
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="naver-url" className="text-sm font-medium">
                네이버 플레이스 URL
              </label>
              <a
                href="https://m.map.naver.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/50 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                <MapPin className="h-3.5 w-3.5" />
                플레이스 찾으러 가기
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <input
              id="naver-url"
              type="text"
              inputMode="url"
              placeholder="https://naver.me/Fio7BDHa  또는  네이버 플레이스 주소"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={submitting}
              className="w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
            />
          </>
        ) : (
          <>
            <div>
              <label htmlFor="place-name" className="text-sm font-medium">
                상호명 <span className="text-muted-foreground/70">(선택 — 미정이면 비워두세요)</span>
              </label>
              <input
                id="place-name"
                type="text"
                placeholder="예: 마산게낙찜 해운대점"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                disabled={submitting}
                className="mt-1.5 w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium">
                주소 <span className="text-primary">*</span>
              </label>
              <input
                id="address"
                type="text"
                placeholder="예: 부산 해운대구 마린시티1로 33"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={submitting}
                className="mt-1.5 w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-muted-foreground/70">
                도로명·지번 모두 OK. 시·구·동까지만 적어도 분석 가능.
              </p>
            </div>
            <div>
              <label htmlFor="category" className="text-sm font-medium">
                카테고리 <span className="text-primary">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                disabled={submitting}
                className="mt-1.5 w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none disabled:opacity-60"
              >
                <option value="">— 선택 —</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground/70">
                AI가 카테고리·주소·서비스/상품 기반으로 중국 관광객 시장 적합성을 종합 점수로 산출합니다.
              </p>
            </div>
            <div>
              <label htmlFor="services" className="text-sm font-medium">
                서비스 · 상품 <span className="text-muted-foreground/70">(선택 — 적을수록 점수 정확도가 올라가요)</span>
              </label>
              <textarea
                id="services"
                placeholder={"예시\n· 웰니스 마사지 (60분/90분)\n· 한방 족욕 패키지\n· 비건 스킨케어 굿즈 판매\n· 명상·요가 클래스"}
                value={services}
                onChange={(e) => setServices(e.target.value)}
                disabled={submitting}
                rows={6}
                className="mt-1.5 w-full rounded-md border border-border/50 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none disabled:opacity-60"
              />
              <p className="mt-1 text-xs text-muted-foreground/70">
                매장에서 파는 서비스·상품·메뉴를 한 줄에 하나씩 적어주세요. AI가 이걸 보고 점수와 플랫폼별 노출 예상을 만들어 드려요.
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              AI 분석 중... (15~25초 걸려요)
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              분석 시작
            </>
          )}
        </button>

        {mode === "url" && (
          <div className="mt-3 rounded-md border border-border/30 bg-background/40 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground/80">붙여넣기 가능한 형태:</p>
            <ul className="mt-1.5 space-y-1">
              <li>
                · 단축링크{" "}
                <span className="font-mono text-foreground/70">https://naver.me/...</span>
              </li>
              <li>
                · 모바일{" "}
                <span className="font-mono text-foreground/70">
                  https://m.place.naver.com/restaurant/...
                </span>
              </li>
              <li>
                · PC 지도{" "}
                <span className="font-mono text-foreground/70">
                  https://map.naver.com/p/entry/place/...
                </span>
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground/70">
              네이버 지도 / 플레이스에서 가게 검색 → <b className="text-foreground/70">공유</b> 버튼 → URL 복사 → 여기에 붙여넣기
            </p>
          </div>
        )}
        {mode === "manual" && (
          <div className="mt-3 rounded-md border border-border/30 bg-background/40 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground/80">언제 쓰나요?</p>
            <ul className="mt-1.5 space-y-1">
              <li>· 아직 오픈하지 않아 네이버 플레이스가 없는 매장</li>
              <li>· 신규 브랜드 / 팝업 / 입점 검토 단계</li>
              <li>· 메뉴 DB 매칭이 어려운 비식음료 업종 (웰니스·화장품·패션·미용 등)</li>
            </ul>
            <p className="mt-2 text-muted-foreground/70">
              주소로 한국관광공사 통계와 매칭된 지역 점수가 나오고, AI가 입력하신 서비스·상품을 보고 적합성 점수와 플랫폼별 노출 예상을 산출합니다.
            </p>
          </div>
        )}
      </form>

      {error && (
        <div className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-medium text-destructive">{error.message}</p>
              {error.hint && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {error.hint}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
