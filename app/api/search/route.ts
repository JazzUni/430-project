import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Book from "@/models/Book";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
        return NextResponse.json({ users: [], books: [] });
  }

    const regex = new RegExp(query, "i");

    const users = await User.find({
        $or: [
            { firstName: regex },
            { lastName: regex },
            { email: regex },
            { phoneNumber: regex },
        ],
    }).limit(10);

    const books = await Book.find({
        $or: [
            { title: regex },
            { author: regex },
            { genre: regex },
            { ISBN: regex },
        ],
    }).limit(10);

    return NextResponse.json({ users, books })
}