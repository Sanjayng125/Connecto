import express from "express";
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

import UserRouter from "./User.routes.js";
import ContactRouter from "./Contact.routes.js";

router.use("/user", UserRouter);
router.use("/contact", ContactRouter);

export default router;
