import { Router } from "express";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.validation";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser
);

router.post("/login", validateRequest(loginSchema), authController.loginUser);

router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  authController.refreshToken
);

export default router;
