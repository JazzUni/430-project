import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Book from "@/models/Book";
import { logActionWithUser } from "@/lib/logActionWithUser";

export const runtime = "nodejs";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await context.params;
    const body = await req.json();

    const updatedBook = await Book.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await logActionWithUser({
      action: "UPDATE_BOOK",
      target: updatedBook.title.toString(),
      targetId: updatedBook._id.toString(),
    });

    return NextResponse.json(updatedBook);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  try {
    const { id } = await context.params;

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await logActionWithUser({
      action: "REMOVE_BOOK",
      target: deletedBook.title.toString(),
      targetId: deletedBook._id.toString(),
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
