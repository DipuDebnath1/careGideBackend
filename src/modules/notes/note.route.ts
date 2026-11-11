import express from "express";
import auth from "../../utils/auth";
import { Role } from "../user/user.const";
import { NoteController } from "./note.controller";
import validationRequest from "../../utils/validationRequest";
import {
  createNoteValidationSchema,
  updateNoteValidationSchema,
} from "./note.validation";

const router = express.Router();

// All note routes require a valid JWT (user or admin)

// ─── User & Admin ─────────────────────────────────────────────────────────────

// Create a note
router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  validationRequest(createNoteValidationSchema),
  NoteController.createNote
);

// Get my own notes
router.get(
  "/my-notes",
  auth(Role.USER, Role.ADMIN),
  NoteController.getMyNotes
);

// Get a single note by ID (owner or admin)
router.get(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  NoteController.getNoteById
);

// Update a note (owner or admin)
router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  validationRequest(updateNoteValidationSchema),
  NoteController.updateNote
);

// Delete a note (owner or admin)
router.delete(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  NoteController.deleteNote
);

// ─── Admin only ───────────────────────────────────────────────────────────────

// View all notes across all users
router.get(
  "/",
  auth(Role.ADMIN),
  NoteController.getAllNotes
);

export default router;
