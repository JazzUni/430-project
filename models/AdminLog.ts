import mongoose, { Schema, Document } from "mongoose";

export interface IAdminLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  target?: string;
  targetId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const AdminLogSchema = new Schema<IAdminLog>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  target: { type: String },
  targetId: { type: mongoose.Schema.Types.ObjectId },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AdminLog ||
  mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);