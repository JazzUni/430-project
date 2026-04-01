import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/api") ||
        pathname.startsWith("/_next") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const session = req.cookies.get("session");

    const isPublicPage = pathname === "/";

    if (isPublicPage) {
        return NextResponse.next();
    }

    if (!session) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        const data = JSON.parse(session.value);
        const TEN_MINUTES = 10 * 60 * 1000;
        
        if (!data.lastActivity || Date.now() - data.lastActivity > TEN_MINUTES) {
            const response = NextResponse.redirect(new URL("/", req.url));
            response.cookies.delete("session");
            return response;
        }
    } catch (err) {
        const response = NextResponse.redirect(new URL("/", req.url));
        response.cookies.delete("session");
        return response;
    }
    
    return NextResponse.next();

}