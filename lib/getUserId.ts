import { cookies } from "next/headers";

export async function getUserIdFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) return null;

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData.userId;
  } catch (err) {
    console.error("Failed to parse session cookie:", err);
    return null;
  }
}