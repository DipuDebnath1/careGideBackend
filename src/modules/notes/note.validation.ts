import { z } from "zod";

export const createNoteValidationSchema = z.object({
  body: z
    .object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
    })
    .strict(),
});

export const updateNoteValidationSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
    })
    .strict(),
});
