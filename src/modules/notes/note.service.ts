import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import Note from "./note.model";

// ─── Create Note ──────────────────────────────────────────────────────────────

const createNote = async (
  userId: string,
  payload: { title: string; content: string }
) => {
  const note = await Note.create({
    title: payload.title,
    content: payload.content,
    owner: new Types.ObjectId(userId),
  });

  return note;
};

// ─── Get Own Notes (User sees only theirs) ────────────────────────────────────

const getMyNotes = async (userId: string, query: Record<string, unknown>) => {

  const filter: any = {owner: new Types.ObjectId(userId), isDeleted: false};
  if (query?.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
    ];
  }

  const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [notes, total] = await Promise.all([
    Note.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select("title content createdAt"),
    Note.countDocuments(filter),
  ]);


  return {
    data:  notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };

};

// ─── Get All Notes (Admin only) ───────────────────────────────────────────────

const getAllNotes = async (query: Record<string, unknown>) => {
    const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {isDeleted: false};
  if (query?.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query?.owner) {
    filter.owner = new Types.ObjectId(query.owner as string);
  }

  const [notes, total] = await Promise.all([
    Note.find(filter)
    .select("title content createdAt isDeleted")
    .populate("owner", "name email role")
    .sort({ createdAt: -1 }).skip(skip).limit(limit),
    Note.countDocuments(filter),
  ]);

  return {
    data: notes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

// ─── Get Single Note ──────────────────────────────────────────────────────────

const getNoteById = async (noteId: string, userId: string, role: string) => {
  const note = await Note.findById(noteId).select("title content createdAt isDeleted").populate("owner", "name email")
  if (!note) throw new AppError(404, "Note not found");

  // Admin can see any note; user only their own
  if (role !== "admin" && note.owner._id.toString() !== userId.toString()) {
    throw new AppError(403, "You are not allowed to view this note");
  }

  return note;
};

// ─── Update Note ──────────────────────────────────────────────────────────────

const updateNote = async (
  noteId: string,
  userId: string,
  role: string,
  payload: { title?: string; content?: string }
) => {
  const note = await Note.findById(noteId);
  if (!note) throw new AppError(404, "Note not found");

  // Admin can update any note; user only their own
  if (role !== "admin" && note.owner.toString() !== userId) {
    throw new AppError(403, "You are not allowed to update this note");
  }

  const updated = await Note.findByIdAndUpdate(noteId, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

// ─── Delete Note ──────────────────────────────────────────────────────────────

const deleteNote = async (noteId: string, userId: string, role: string) => {
  const note = await Note.findById(noteId);
  if (!note) throw new AppError(404, "Note not found");

  // Admin can delete any note; user only their own
  if (role !== "admin" && note.owner.toString() !== userId) {
    throw new AppError(403, "You are not allowed to delete this note");
  }

  await Note.findByIdAndUpdate(noteId, {isDeleted: true});

  return { message: "Note deleted successfully" };
};

export const NoteService = {
  createNote,
  getMyNotes,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
