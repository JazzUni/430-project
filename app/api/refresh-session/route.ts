import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies()
    const session = cookieStore.get("session");

    if (!session) {
        return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    const data = JSON.parse(session.value)

    data.lastActivity = Date.now();

    const response = NextResponse.json({ message: "session refreshed" });

    response.cookies.set("session", JSON.stringify(data), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 10
    });

    return response;

}