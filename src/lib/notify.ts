import type { Inquiry } from "@/lib/inquiry";

// 새 상담 신청 알림 (텔레그램). 환경변수 미설정 시 조용히 스킵.
export async function notifyNewInquiry(inq: Inquiry): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    "🔔 새 상담 신청이 들어왔어요",
    "",
    `🏪 상호명: ${inq.business}`,
    `📞 연락처: ${inq.contact}`,
    inq.industry ? `🏷️ 업종: ${inq.industry}` : "",
    inq.region ? `📍 지역: ${inq.region}` : "",
    inq.budget ? `💰 예산: ${inq.budget}` : "",
    inq.message ? `📝 내용: ${inq.message}` : "",
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
    });
  } catch {
    /* 알림 실패는 무시 (문의 저장 자체는 성공) */
  }
}
