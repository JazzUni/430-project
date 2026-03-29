import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import argon2 from "argon2";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await argon2.hash(password);

    // create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType: "User",
    });

    return NextResponse.json({ message: "User created", user: newUser });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}