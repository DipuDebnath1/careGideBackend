import { Schema, model } from "mongoose";
import { INote } from "./note.interface";

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Fast look-up by owner
noteSchema.index({ owner: 1 });

const Note = model<INote>("Note", noteSchema);

export default Note;
