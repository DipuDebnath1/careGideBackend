import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { NoteService } from "./note.service";

// Helper: pull userId and role from token (attached by auth middleware)
const getAuthUser = (req: Request) => {
  const user = (req as any).user;
  return { userId: user?.userId as string, role: user?.role as string };
};

// ─── Create Note ──────────────────────────────────────────────────────────────

const createNote = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const note = await NoteService.createNote(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Note created successfully",
    data: note,
  });
});

// ─── Get My Notes ─────────────────────────────────────────────────────────────

const getMyNotes = catchAsync(async (req: Request, res: Response) => {
  const { userId } = getAuthUser(req);
  const notes = await NoteService.getMyNotes(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notes retrieved successfully",
    data: notes,
  });
});

// ─── Get All Notes (Admin) ────────────────────────────────────────────────────

const getAllNotes = catchAsync(async (req: Request, res: Response) => {
  const notes = await NoteService.getAllNotes(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notes retrieved successfully",
    data: notes,
  });
});

// ─── Get Single Note ──────────────────────────────────────────────────────────

const getNoteById = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = getAuthUser(req);
  const note = await NoteService.getNoteById(req.params.id  as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Note retrieved successfully",
    data: note,
  });
});

// ─── Update Note ──────────────────────────────────────────────────────────────

const updateNote = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = getAuthUser(req);
  const note = await NoteService.updateNote(
    req.params.id as string,
    userId,
    role,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Note updated successfully",
    data: note,
  });
});

// ─── Delete Note ──────────────────────────────────────────────────────────────

const deleteNote = catchAsync(async (req: Request, res: Response) => {
  const { userId, role } = getAuthUser(req);
  const result = await NoteService.deleteNote(req.params.id as string, userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const NoteController = {
  createNote,
  getMyNotes,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
