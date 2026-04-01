import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Reservation from "@/models/Reservation";
import Book from "@/models/Book";
import User from "@/models/User";
import { logActionWithUser } from "@/lib/logActionWithUser";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { bookId, memberEmail } = await req.json();

    if (!bookId || !memberEmail) {
      return NextResponse.json(
        { error: "Book and member email are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: memberEmail.trim().toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.copies.avail > 0) {
      return NextResponse.json(
        { error: "Book is available. Borrow it instead of reserving." },
        { status: 400 }
      );
    }

    const existingReservation = await Reservation.findOne({
      bookISBN: book.ISBN,
      memberID: user._id,
      status: "active",
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: "This member already has an active reservation for this book" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.create({
      bookISBN: book.ISBN,
      memberID: user._id,
      status: "active",
    });

    await Book.findByIdAndUpdate(bookId, {
      $inc: { "copies.reserved": 1 },
    });

    await logActionWithUser({
      action: "RESERVE_BOOK",
      target: `${book.title} -> ${memberEmail}`,
      targetId: reservation._id.toString(),
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
