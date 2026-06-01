// DEPRECATED — 비번 기반 어드민 인증은 더 이상 사용하지 않습니다.
// 어드민은 /login 에서 카카오/매직링크로 로그인 + ADMIN_EMAILS 매칭으로 판별.
//
// 이 엔드포인트는 기존 호출이 남아있을 경우를 대비해 항상 거부 반환.

export async function POST() {
  return Response.json(
    {
      ok: false,
      error: "비밀번호 방식 어드민은 사용 중단됐어요. /login 으로 로그인해주세요.",
    },
    { status: 410 },
  );
}
