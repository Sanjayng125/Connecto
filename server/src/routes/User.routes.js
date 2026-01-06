import express from "express";
import {
  getSession,
  login,
  logout,
  refreshToken,
  signup,
  updateProfile,
} from "../controllers/User.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  signupSchema,
  updateProfileSchema,
} from "@connecto/shared/validations";
import multer from "multer";

const router = express.Router();

router.post("/auth/signup", validate(signupSchema), signup);
router.post("/auth/login", login);
router.post("/auth/refresh", refreshToken);
router.post("/auth/logout", requireAuth, logout);
router.get("/auth/me", requireAuth, getSession);

const upload = multer();
router.patch(
  "/auth/profile",
  requireAuth,
  upload.single("file"),
  validate(updateProfileSchema),
  updateProfile
);

export default router;
