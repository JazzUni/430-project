import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description?: string;
  genre?: string;
  publisher?: string;
  publicationDate?: string;
  ISBN: string;
  location?: string;
  copies: {
    total: number;
    avail: number;
    reserved: number;
  };
}

const BookSchema = new Schema<IBook>({
  title:           { type: String, required: true },
  author:          { type: String, required: true },
  description:     { type: String },
  genre:           { type: String },
  publisher:       { type: String },
  publicationDate: { type: String },
  ISBN:            { type: String, required: true, unique: true },
  location:        { type: String },
  copies: {
    total:    { type: Number, required: true, default: 1 },
    avail:    { type: Number, required: true, default: 1 },
    reserved: { type: Number, required: true, default: 0 },
  },
});

export default mongoose.models.Book || mongoose.model<IBook>("Book", BookSchema);