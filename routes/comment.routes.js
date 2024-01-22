// comment.routes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");

// Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// Create a new comment
router.post("/", async (req, res) => {
  const { text, userId } = req.body;

  try {
    const newComment = await Comment.create({ text, userId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error creating comment", error });
  }
});

// Other routes like updating and deleting comments can be added if needed

module.exports = router;
