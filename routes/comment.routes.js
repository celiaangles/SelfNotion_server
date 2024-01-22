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

// Create or Update a comment
router.post("/", async (req, res) => {
  const { text, userId, commentId } = req.body;

  try {
    // Check if commentId is provided; if yes, update the existing comment
    if (commentId) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { text, updatedAt: Date.now() },
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      return res.json(updatedComment);
    }

    // If commentId is not provided, create a new comment
    const newComment = await Comment.create({ text, userId });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Error creating/updating comment", error });
  }
});

// Other routes like deleting comments can be added if needed

module.exports = router;
