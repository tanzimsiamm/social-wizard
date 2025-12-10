import { Router } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser
);

router.post("/login", validateRequest(loginSchema), authController.loginUser);

export default router;
