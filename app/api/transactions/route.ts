import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import Book from "@/models/Book";
import User from "@/models/User";

export const runtime = "nodejs";

// GET transactions by member email
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json([], { status: 200 });
  const transactions = await Transaction.find({ memberID: user._id, status: "borrowed" });
  return NextResponse.json(transactions);
}

// POST - borrow a book
export async function POST(req: Request) {
  await dbConnect();
  const { bookId, memberEmail } = await req.json();
  const user = await User.findOne({ email: memberEmail });
  if (!user) return NextResponse.json({ error: "Member not found" }, { status: 404 });
  const book = await Book.findById(bookId);
  if (!book || book.copies.avail < 1)
    return NextResponse.json({ error: "Book not available" }, { status: 400 });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // 2 week loan

  const transaction = await Transaction.create({
    bookISBN: book.ISBN,
    memberID: user._id,
    borrowDate: new Date(),
    dueDate,
    status: "borrowed",
  });

  await Book.findByIdAndUpdate(bookId, { $inc: { "copies.avail": -1 } });
  return NextResponse.json(transaction, { status: 201 });
}

// PUT - return a book
export async function PUT(req: Request) {
  await dbConnect();
  const { transactionId } = await req.json();
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  await Transaction.findByIdAndUpdate(transactionId, {
    returnDate: new Date(),
    status: "returned",
  });

  await Book.findOneAndUpdate(
    { ISBN: transaction.bookISBN },
    { $inc: { "copies.avail": 1 } }
  );

  return NextResponse.json({ message: "Book returned successfully" });
}