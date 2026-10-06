import express from "express";
import mongoose from "mongoose";
import { Article } from "../models/ArticleModel.js";
import { User } from "../models/UserTypeModel.js";
import { getAuth } from "@clerk/express";

export const authorRouter = express.Router();

async function requireAuthor(req, res) {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  const author = await User.findOne({ clerkUserId: userId, isActive: true });
  if (!author) {
    res.status(404).json({ message: "Author profile not found" });
    return null;
  }
  if (author.role !== "AUTHOR") {
    res.status(403).json({ message: "Only authors can manage articles" });
    return null;
  }
  return author;
}

authorRouter.post("/article", async (req, res) => {
  const author = await requireAuthor(req, res);
  if (!author) return;
  const { title, category, content } = req.body;
  if (![title, category, content].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Title, category, and content are required" });
  }
  const article = await Article.create({ author: author._id, title: title.trim(), category: category.trim(), content: content.trim() });
  res.status(201).json({ message: "Article created", payload: article });
});

authorRouter.get("/articles", async (req, res) => {
  const author = await requireAuthor(req, res);
  if (!author) return;
  const articles = await Article.find({ author: author._id, isArticleActive: true }).sort({ updatedAt: -1 });
  res.json({ message: "author articles", payload: articles });
});

authorRouter.put("/articles/:articleId", async (req, res) => {
  const author = await requireAuthor(req, res);
  if (!author) return;
  if (!mongoose.isValidObjectId(req.params.articleId)) return res.status(400).json({ message: "Invalid article id" });
  const article = await Article.findOneAndUpdate(
    { _id: req.params.articleId, author: author._id, isArticleActive: true },
    { $set: { isArticleActive: false } },
    { new: true },
  );
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Article deleted" });
});

authorRouter.put("/articles/:articleId/edit", async (req, res) => {
  const author = await requireAuthor(req, res);
  if (!author) return;
  if (!mongoose.isValidObjectId(req.params.articleId)) return res.status(400).json({ message: "Invalid article id" });
  const updates = {};
  for (const field of ["title", "category", "content"]) {
    if (req.body[field] !== undefined) {
      if (typeof req.body[field] !== "string" || !req.body[field].trim()) return res.status(400).json({ message: `${field} cannot be empty` });
      updates[field] = req.body[field].trim();
    }
  }
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No article fields provided" });
  const article = await Article.findOneAndUpdate(
    { _id: req.params.articleId, author: author._id, isArticleActive: true },
    { $set: updates },
    { new: true, runValidators: true },
  );
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Article updated", payload: article });
});
