import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

// ============================================
// 타입 정의
// ============================================

export type MenuCategory =
  | "절대선호"
  | "매우선호"
  | "선호"
  | "약간선호"
  | "보통(긍정)"
  | "보통(중립)"
  | "약간비선호"
  | "비선호"
  | "매우비선호"
  | "절대비선호";

export interface MenuItem {
  id: string;
  name: string;
  tier: number; // 1 ~ 10
  score: number;
  category: MenuCategory;
}

export interface SidoItem {
  id: string;
  name: string;
  baseScore: number;
  note: string;
}

export interface SigunguItem {
  id: string;
  sido: string;
  name: string;
  baseScore: number;
  note: string;
}

export interface SanggwonItem {
  id: string;
  sido: string;
  sigungu: string;
  name: string;
  score: number;
  dongKeywords: string[];
  roadKeywords: string[];
  auxKeywords: string[];
  note: string;
}

// 시군구별 외국인·중국인 관광 통계 (한국관광공사 기반)
export interface RegionStatsItem {
  sido: string;
  sigungu: string;
  annualForeignVisitors: number;        // 연간 외국인 방문수
  chineseRatioPct: number;              // 외국인 중 중국인 비중 (%)
  annualChineseVisitors: number;        // 연간 중국인 추정
  monthlyChineseVisitors: number;       // 월간 중국인 추정
  nationalRank: number;                 // 전국 외국인 방문 시군구 순위
  cardSpendShareInSido: number;         // 시도 내 외국인 카드 소비 비중 (%)
  note: string;
}

export interface ScoreData {
  menus: MenuItem[];
  sidos: SidoItem[];
  sigungus: SigunguItem[];
  sanggwons: SanggwonItem[];
  regionStats: RegionStatsItem[];

  // 빠른 조회용 인덱스
  menuByName: Map<string, MenuItem>;
  sidoByName: Map<string, SidoItem>;
  sigunguByKey: Map<string, SigunguItem>; // key = `${sido}|${name}`
  sanggwonByName: Map<string, SanggwonItem>;
  regionStatsByKey: Map<string, RegionStatsItem>; // key = `${sido}|${sigungu}`

  loadedAt: Date;
}

// ============================================
// CSV 로더
// ============================================

const DATA_DIR = path.join(process.cwd(), "src/data/analyze");

function readCsv<T>(
  filename: string,
  mapper: (row: Record<string, string>, idx: number) => T | null,
): T[] {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), "utf-8");
  const clean = raw.replace(/^﻿/, ""); // BOM 제거

  const parsed = Papa.parse<Record<string, string>>(clean, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    console.warn(`[scoreData] ${filename} parse warnings:`, parsed.errors.slice(0, 3));
  }

  const out: T[] = [];
  parsed.data.forEach((row, i) => {
    const v = mapper(row, i);
    if (v) out.push(v);
  });
  return out;
}

function splitKeywords(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

// ============================================
// globalThis 캐싱 (dev 핫리로드 시에도 1회만 로드)
// ============================================

const g = globalThis as unknown as { __scoreData?: ScoreData };

function load(): ScoreData {
  const menus = readCsv<MenuItem>("menu_db.csv", (r) => {
    const id = r["메뉴ID"];
    const name = r["메뉴명"];
    if (!id || !name) return null;
    return {
      id,
      name,
      tier: Number(r["단계"] ?? 0),
      score: Number(r["점수"] ?? 0),
      category: (r["분류"] ?? "") as MenuCategory,
    };
  });

  const sidos = readCsv<SidoItem>("region_db_1_sido.csv", (r) => {
    const id = r["시도ID"];
    const name = r["시도명"];
    if (!id || !name) return null;
    return {
      id,
      name,
      baseScore: Number(r["기본점수"] ?? 0),
      note: r["비고"] ?? "",
    };
  });

  const sigungus = readCsv<SigunguItem>("region_db_2_sigungu.csv", (r) => {
    const id = r["시군구ID"];
    const name = r["시군구명"];
    if (!id || !name) return null;
    return {
      id,
      sido: r["상위시도"] ?? "",
      name,
      baseScore: Number(r["기본점수"] ?? 0),
      note: r["비고"] ?? "",
    };
  });

  const sanggwons = readCsv<SanggwonItem>("region_db_3_sanggwon.csv", (r) => {
    const id = r["상권ID"];
    const name = r["상권명"];
    if (!id || !name) return null;
    return {
      id,
      sido: r["상위시도"] ?? "",
      sigungu: r["상위시군구"] ?? "",
      name,
      score: Number(r["점수"] ?? 0),
      dongKeywords: splitKeywords(r["동키워드"]),
      roadKeywords: splitKeywords(r["도로명키워드"]),
      auxKeywords: splitKeywords(r["보조키워드"]),
      note: r["비고"] ?? "",
    };
  });

  const regionStats = readCsv<RegionStatsItem>("region_stats.csv", (r) => {
    const sido = r["시도"];
    const sigungu = r["시군구"];
    if (!sido || !sigungu) return null;
    return {
      sido,
      sigungu,
      annualForeignVisitors: Number(r["연간외국인방문수"] ?? 0),
      chineseRatioPct: Number(r["중국인비중"] ?? 0),
      annualChineseVisitors: Number(r["연간중국인추정"] ?? 0),
      monthlyChineseVisitors: Number(r["월간중국인추정"] ?? 0),
      nationalRank: Number(r["전국방문순위"] ?? 0),
      cardSpendShareInSido: Number(r["외국인카드소비비중"] ?? 0),
      note: r["비고"] ?? "",
    };
  });

  return {
    menus,
    sidos,
    sigungus,
    sanggwons,
    regionStats,
    menuByName: new Map(menus.map((m) => [m.name, m])),
    sidoByName: new Map(sidos.map((s) => [s.name, s])),
    sigunguByKey: new Map(sigungus.map((s) => [`${s.sido}|${s.name}`, s])),
    sanggwonByName: new Map(sanggwons.map((s) => [s.name, s])),
    regionStatsByKey: new Map(
      regionStats.map((s) => [`${s.sido}|${s.sigungu}`, s]),
    ),
    loadedAt: new Date(),
  };
}

/** 점수 기준 데이터를 반환. 최초 호출 시 CSV에서 1회 로드. */
export function getScoreData(): ScoreData {
  if (!g.__scoreData) g.__scoreData = load();
  return g.__scoreData;
}

/** 캐시 무효화 (CSV 교체 후 강제 재로딩이 필요할 때) */
export function reloadScoreData(): ScoreData {
  g.__scoreData = load();
  return g.__scoreData;
}
