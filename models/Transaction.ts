import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  bookISBN: string;
  memberID: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "borrowed" | "returned";
}

const TransactionSchema = new Schema<ITransaction>({
  bookISBN:   { type: String, required: true },
  memberID:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  borrowDate: { type: Date, required: true },
  dueDate:    { type: Date, required: true },
  returnDate: { type: Date },
  status:     { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);