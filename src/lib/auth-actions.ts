"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInKakao(redirectTo: string = "/") {
  await signIn("kakao", { redirectTo });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
