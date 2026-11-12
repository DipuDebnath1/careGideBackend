import express from "express";
import auth from "../../utils/auth";
import validationRequest from "../../utils/validationRequest";
import { Role } from "../user/user.const";
import { PostController } from "./post.controller";
import { createPostValidationSchema } from "./post.validation";

const router = express.Router();

// Posts are public. Writing one requires a logged-in user.
router.get("/", PostController.getPosts);

router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  validationRequest(createPostValidationSchema),
  PostController.createPost
);

export default router;
