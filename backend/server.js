import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./APIs/UserAPI.js";
import { authorRouter } from "./APIs/AuthorAPI.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(clerkMiddleware());
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/user-api", userRouter);
app.use("/author-api", authorRouter);
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: status === 500 ? "Internal server error" : err.message });
});

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/blog_app";
try {
  await mongoose.connect(mongoUri);
  console.log("Database connected");
  app.listen(port, () => console.log(`API server listening on port ${port}`));
} catch (error) {
  console.error("Could not connect to MongoDB:", error.message);
  process.exit(1);
}
