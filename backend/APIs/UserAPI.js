import express from "express";
import mongoose from "mongoose";
import { User } from "../models/UserTypeModel.js";
import { Article } from "../models/ArticleModel.js";
import { getAuth, clerkClient } from "@clerk/express";

export const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const user = await User.findOne({ clerkUserId: userId, isActive: true });
  if (!user) return res.json({ firstLogin: true });
  res.json({ firstLogin: false, payload: user });
});

userRouter.post("/create-user", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const { role } = req.body;
  if (!["USER", "AUTHOR"].includes(role)) return res.status(400).json({ message: "Role must be USER or AUTHOR" });
  const existing = await User.findOne({ clerkUserId: userId });
  if (existing) return res.status(409).json({ message: "Profile already exists" });
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.primaryEmailAddress?.emailAddress;
  if (!email) return res.status(400).json({ message: "Your Clerk account needs a primary email address" });
  const user = await User.create({
    clerkUserId: userId,
    role,
    firstName: clerkUser.firstName || "User",
    lastName: clerkUser.lastName || "",
    email,
    profileImageUrl: clerkUser.imageUrl,
    isActive: true,
  });
  res.status(201).json({ message: "Profile created successfully", payload: user });
});

userRouter.get("/articles", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  const articles = await Article.find({ isArticleActive: true })
    .populate("author", "firstName lastName profileImageUrl")
    .sort({ updatedAt: -1 });
  res.json({ message: "articles", payload: articles });
});

userRouter.get("/articles/:articleId", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!mongoose.isValidObjectId(req.params.articleId)) return res.status(400).json({ message: "Invalid article id" });
  const article = await Article.findOne({ _id: req.params.articleId, isArticleActive: true })
    .populate("author", "firstName lastName profileImageUrl")
    .populate("comments.user", "firstName");
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "article", payload: article });
});

userRouter.post("/comment/:articleId", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ message: "Authentication required" });
  if (!mongoose.isValidObjectId(req.params.articleId)) return res.status(400).json({ message: "Invalid article id" });
  if (typeof req.body.comment !== "string" || !req.body.comment.trim()) return res.status(400).json({ message: "Comment is required" });
  const user = await User.findOne({ clerkUserId: userId, isActive: true });
  if (!user) return res.status(404).json({ message: "User profile not found" });
  if (user.role !== "USER") return res.status(403).json({ message: "Only users can comment" });
  const article = await Article.findOneAndUpdate(
    { _id: req.params.articleId, isArticleActive: true },
    { $push: { comments: { user: user._id, comment: req.body.comment.trim() } } },
    { new: true, runValidators: true },
  ).populate("comments.user", "firstName");
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Comment added", payload: article });
});
