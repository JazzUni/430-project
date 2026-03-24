import dbConnect from "@/lib/dbConnect";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Book from "@/models/Book";


export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    await dbConnect();

    try {

        const transactions = await Transaction.find({
            memberID: new mongoose.Types.ObjectId(id),
            status: "borrowed",
        });

        const enriched = await Promise.all(
            transactions.map(async (t) => {
                const book = await Book.findOne({ ISBN: t.bookISBN });

                return {
                    ...t.toObject(),
                    book,
                };
            })
        );

        return NextResponse.json(enriched);
        
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}