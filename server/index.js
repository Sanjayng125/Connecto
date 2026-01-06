import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./src/db/mongo.js";
import server from "./src/app.js";
import { connectRedis } from "./src/db/redis.js";

const start = async () => {
  // DB connect
  await connectDB();
  await connectRedis();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Server running on port:", PORT));
};

start();
