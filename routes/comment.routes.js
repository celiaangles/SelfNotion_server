// comment.routes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");

// Get all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.query.userId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

// Create or update a comment
router.post("/", async (req, res) => {
  const { text, userId, commentId } = req.body;

  try {
    if (commentId) {
      // Update existing comment
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { text },
        { new: true }
      );
      res.status(200).json(updatedComment);
    } else {
      // Create a new comment
      const newComment = await Comment.create({ text, userId });
      res.status(201).json(newComment);
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating/updating comment", error });
  }
});

module.exports = router;
