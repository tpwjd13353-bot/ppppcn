// ⚠️ DEPRECATED — 어드민 인증은 이제 세션 기반(/admin layout 가드)으로 동작합니다.
//
// 이 모듈은 기존 어드민 페이지 클라이언트 코드(localStorage 기반 비번 폼)와의
// 호환을 위해 stub만 남겨둡니다. /admin layout이 이미 어드민 권한을 확인했으므로,
// loadAuth는 항상 dummy 값을 반환 → 비번 폼 자동 우회.
//
// fetch 시 x-admin-password 헤더는 더 이상 API 라우트에서 사용하지 않음
// (requireAdmin()이 세션으로 판별).

const STUB = "session-based";

export function saveAuth(_password: string) {
  // no-op
  void _password;
}

export function loadAuth(): string | null {
  return STUB;
}

export function clearAuth() {
  // no-op
}
