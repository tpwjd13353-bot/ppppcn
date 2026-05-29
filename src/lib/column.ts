export type Column = {
  id: string;
  title: string;
  summary: string;
  thumbnail: string; // 대표 이미지 (카드·미리보기 전용, 1장)
  body: string; // 본문 (줄바꿈 보존)
  date: string; // YYYY-MM-DD
  images?: string[]; // 본문 이미지 (상세에서 세로로 표시, 여러 장)
};

export type ColumnData = { columns: Column[] };
