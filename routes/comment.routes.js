// // comment.routes.js
// const express = require("express");
// const router = express.Router();
// const Comment = require("../models/Comment.model");

// // Get all comments
// router.get("/", async (req, res) => {
//   try {
//     const comments = await Comment.find({ userId: req.query.userId });
//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching comments", error });
//   }
// });

// // Create or update a comment
// router.post("/", async (req, res) => {
//   const { text, userId, commentId } = req.body;

//   try {
//     if (commentId) {
//       // Update existing comment
//       const updatedComment = await Comment.findByIdAndUpdate(
//         commentId,
//         { text },
//         { new: true }
//       );
//       res.status(200).json(updatedComment);
//     } else {
//       // Create a new comment
//       const newComment = await Comment.create({ text, userId });
//       res.status(201).json(newComment);
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error creating/updating comment", error });
//   }
// });

// module.exports = router;

// comment.routes.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment.model");

// Get the user's comment
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;

    // Check if the user already has a comment
    const existingComment = await Comment.findOne({ userId });

    if (existingComment) {
      res.json([existingComment]); // Return an array with the existing comment
    } else {
      res.json([]); // Return an empty array if no comment exists
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching comment", error });
  }
});

// Create or update a comment
router.post("/", async (req, res) => {
  const { text, userId } = req.body;

  try {
    // Check if the user already has a comment
    const existingComment = await Comment.findOne({ userId });

    if (existingComment) {
      // Update existing comment
      const updatedComment = await Comment.findOneAndUpdate(
        { userId },
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
