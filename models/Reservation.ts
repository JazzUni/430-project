import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  bookISBN: string;
  memberID: mongoose.Types.ObjectId;
  reservedAt: Date;
  status: "active" | "fulfilled" | "cancelled";
}

const ReservationSchema = new Schema<IReservation>({
  bookISBN: { type: String, required: true },
  memberID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reservedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "fulfilled", "cancelled"],
    default: "active",
  },
});

export default mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);
