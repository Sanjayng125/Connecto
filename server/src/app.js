import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import errorHandler from "./middlewares/errorHandler.js";
import { asyncHandler } from "./middlewares/asyncHandler.js";
import { handleSocket } from "./socket/index.js";
import Router from "./routes/index.router.js";
import { notFoundError } from "./utils/errors.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

handleSocket(server);

// Routes
app.use("/api", Router);

app.use(
  asyncHandler(async (req, res) => {
    throw notFoundError(`Can't find ${req.originalUrl}`);
  })
);

app.use(errorHandler);

export default server;
