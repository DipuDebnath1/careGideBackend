import express from 'express';
import { AuthController } from './auth.controller';
import validationRequest from '../../utils/validationRequest';
import {  loginValidationSchema, registerValidationSchema } from './auth.validation';

const router = express.Router();

router.post("/signup",validationRequest(registerValidationSchema), AuthController.register);
router.post("/signin", validationRequest(loginValidationSchema), AuthController.login);

export default router;
