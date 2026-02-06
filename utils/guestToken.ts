import Cookies from "js-cookie";

const COOKIE_NAME = "guest_token";

export function getGuestToken(): string {
  let token = Cookies.get(COOKIE_NAME);

  if (!token) {
    token = crypto.randomUUID(); // bikin UUID baru
    Cookies.set(COOKIE_NAME, token, {
      expires: 7, // 7 hari
      path: "/",
      sameSite: "lax",
    });
  }

  return token;
}
