import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import argon2 from "argon2";
import User from "@/models/User";

export const runtime = "nodejs";
export async function POST(req: Request) {

    const { email, password } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });

    if (!user || user.userType !== "Admin") {
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
        return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login Successful" });
    // open dashboard
}
