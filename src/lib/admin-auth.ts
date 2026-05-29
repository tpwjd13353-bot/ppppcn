// 관리자 로그인 유지 (localStorage + 7일 만료)
const KEY = "admin_auth";
const TTL = 7 * 24 * 60 * 60 * 1000; // 7일

export function saveAuth(password: string) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ password, expires: Date.now() + TTL }),
    );
  } catch {
    /* ignore */
  }
}

export function loadAuth(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { password, expires } = JSON.parse(raw) as {
      password?: string;
      expires?: number;
    };
    if (!password || !expires || Date.now() > expires) {
      localStorage.removeItem(KEY);
      return null;
    }
    return password;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
