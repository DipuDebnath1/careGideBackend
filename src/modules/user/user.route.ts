import express from "express";
import auth from "../../utils/auth";
import { Role } from "./user.const";
import { UserController } from "./user.controller";
import validationRequest from "../../utils/validationRequest";
import {
  adminCreateUserValidationSchema,
  adminUpdateUserValidationSchema,
  updateUserSelfProfileValidationSchema,
} from "./user.validation";

const router = express.Router();

// All routes here are admin-only
router.patch("/self",     auth(Role.USER, Role.ADMIN), validationRequest(updateUserSelfProfileValidationSchema), UserController.updateUserSelfProfile);
router.get("/",          auth(Role.ADMIN), UserController.getAllUsers);
router.get("/self",      auth(Role.USER, Role.ADMIN), UserController.getUserSelf);
router.get("/grouped-by-interests", auth(Role.USER, Role.ADMIN), UserController.getUsersGroupedByInterest);
router.get("/:id",       auth(Role.ADMIN), UserController.getUserById);
router.post("/",         auth(Role.ADMIN), validationRequest(adminCreateUserValidationSchema), UserController.createUser);
router.patch("/:id",     auth(Role.ADMIN), validationRequest(adminUpdateUserValidationSchema), UserController.updateUser);
router.delete("/:id",    auth(Role.ADMIN), UserController.deleteUser);

export default router;
