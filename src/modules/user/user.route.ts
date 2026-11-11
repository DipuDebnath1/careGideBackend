import express from "express";
import auth from "../../utils/auth";
import { Role } from "./user.const";
import { UserController } from "./user.controller";
import validationRequest from "../../utils/validationRequest";
import {
  adminCreateUserValidationSchema,
  adminUpdateUserValidationSchema,
} from "./user.validation";

const router = express.Router();

// All routes here are admin-only
router.get("/",          auth(Role.ADMIN), UserController.getAllUsers);
router.get("/:id",       auth(Role.ADMIN), UserController.getUserById);
router.post("/",         auth(Role.ADMIN), validationRequest(adminCreateUserValidationSchema), UserController.createUser);
router.patch("/:id",     auth(Role.ADMIN), validationRequest(adminUpdateUserValidationSchema), UserController.updateUser);
router.delete("/:id",    auth(Role.ADMIN), UserController.deleteUser);

export default router;
