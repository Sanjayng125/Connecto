import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/auth.js";
import { redis } from "../db/redis.js";
import { unauthorizedError } from "../utils/errors.js";

export const handleSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket?.handshake?.auth?.accessToken;

      if (!token) {
        return next(unauthorizedError("Not authenticated!"));
      }

      const decoded = verifyAccessToken(token);

      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch {
      next(unauthorizedError("Not authenticated!"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.userId;

    await redis.set(`socket:${userId}`, socket.id);

    socket.on("call:initiate", async ({ to }) => {
      const targetSocket = await redis.get(`socket:${to}`);

      if (!targetSocket) {
        socket.emit("call:contact-offline", { contactUserId: to });
        return;
      }

      io.to(targetSocket).emit("call:incoming", {
        from: userId,
        fromUsername: socket.username,
      });
    });

    socket.on("call:reject", async ({ to }) => {
      const callerSocket = await redis.get(`socket:${to}`);
      if (callerSocket) {
        io.to(callerSocket).emit("call:rejected");
      }
    });

    socket.on("call:accept", async ({ to }) => {
      const callerSocket = await redis.get(`socket:${to}`);
      if (callerSocket) {
        io.to(callerSocket).emit("call:accepted", { by: userId });
      }
    });

    socket.on("call:offer", async ({ to, offer }) => {
      const targetSocket = await redis.get(`socket:${to}`);
      if (targetSocket) {
        io.to(targetSocket).emit("call:offer", {
          from: userId,
          offer,
        });
      }
    });

    socket.on("call:answer", async ({ to, answer }) => {
      const targetSocket = await redis.get(`socket:${to}`);
      if (targetSocket) {
        io.to(targetSocket).emit("call:answer", {
          from: userId,
          answer,
        });
      }
    });

    socket.on("call:ice-candidate", async ({ to, candidate }) => {
      const targetSocket = await redis.get(`socket:${to}`);
      if (targetSocket) {
        io.to(targetSocket).emit("call:ice-candidate", {
          from: userId,
          candidate,
        });
      }
    });

    socket.on("call:end", async ({ to }) => {
      const targetSocket = await redis.get(`socket:${to}`);
      if (targetSocket) {
        io.to(targetSocket).emit("call:ended", { from: userId });
      }
    });

    socket.on("disconnect", async () => {
      await redis.del(`socket:${userId}`);
    });
  });
};
