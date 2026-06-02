// Cool SMS (v4 API) — 단문 SMS 발송
// https://docs.coolsms.co.kr/

import crypto from "node:crypto";

const API_BASE = "https://api.coolsms.co.kr";

function getSignature(apiSecret: string, date: string, salt: string) {
  return crypto
    .createHmac("sha256", apiSecret)
    .update(date + salt)
    .digest("hex");
}

export async function sendSms(
  to: string,
  text: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.COOLSMS_API_KEY;
  const apiSecret = process.env.COOLSMS_API_SECRET;
  const from = process.env.COOLSMS_SENDER;

  if (!apiKey || !apiSecret || !from) {
    return {
      ok: false,
      error: "Cool SMS 환경변수가 설정되지 않았습니다.",
    };
  }

  // 휴대폰 번호 정규화: 숫자만 남기기
  const toClean = to.replace(/[^0-9]/g, "");
  const fromClean = from.replace(/[^0-9]/g, "");
  if (!/^010\d{8}$/.test(toClean)) {
    return { ok: false, error: "휴대폰 번호 형식이 올바르지 않습니다." };
  }

  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString("hex");
  const signature = getSignature(apiSecret, date, salt);

  try {
    const res = await fetch(`${API_BASE}/messages/v4/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
      },
      body: JSON.stringify({
        message: {
          to: toClean,
          from: fromClean,
          text,
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { ok: false, error: `Cool SMS API 오류 (${res.status}): ${errBody.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Cool SMS 호출 실패",
    };
  }
}

export function generateCode(): string {
  // 6자리 랜덤 숫자 (앞자리 0 허용)
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export function normalizePhone(input: string): string {
  return (input ?? "").replace(/[^0-9]/g, "");
}
