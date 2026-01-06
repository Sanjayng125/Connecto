import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("No Mongo URI Found ❌");
    await mongoose.connect(MONGO_URI);
    console.log("Connected To MongoDB ✅");
  } catch (error) {
    console.log("Error Connecting To MongoDB ❌: ", error);
    process.exit(1);
  }
};
