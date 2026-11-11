import express from 'express';
import { AuthController } from './auth.controller';
import validationRequest from '../../utils/validationRequest';
import {
  loginValidationSchema,
  registerValidationSchema,
  forgotPasswordValidationSchema,
  verifyOtpValidationSchema,
  resetPasswordValidationSchema,
  updatePasswordValidationSchema,
} from './auth.validation';
import auth from '../../utils/auth';
import { Role } from '../user/user.const';

const router = express.Router();

router.post("/signup",       validationRequest(registerValidationSchema),     AuthController.register);
router.post("/signin",       validationRequest(loginValidationSchema),         AuthController.login);
router.post("/forgot-password", validationRequest(forgotPasswordValidationSchema), AuthController.forgotPassword);
router.post("/verify-otp",   validationRequest(verifyOtpValidationSchema),    AuthController.verifyOtp);
router.post("/reset-password",  validationRequest(resetPasswordValidationSchema),  AuthController.resetPassword);

router.patch("/update-password",auth(Role.ADMIN, Role.USER), validationRequest(updatePasswordValidationSchema), AuthController.updatePassword);

export default router;
