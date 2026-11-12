import { Document, Types } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  owner: Types.ObjectId;   // ref → User
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
