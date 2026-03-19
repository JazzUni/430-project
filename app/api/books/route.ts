import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";

export const runtime = "nodejs";

// GET all books
export async function GET() {
  await dbConnect();
  const books = await Book.find({});
  return NextResponse.json(books);
}

// POST new book
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  try {
    const book = await Book.create(body);
    return NextResponse.json(book, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}