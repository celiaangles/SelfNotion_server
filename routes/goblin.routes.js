const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Goblin = require("../models/Goblin.model");
const Nuvol = require("../models/Nuvol.model");

// Set up multer storage for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/goblins", upload.single("flowerImage"), (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body
  console.log("Request File:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "File not provided" });
  }
  const { garden, nuvolId } = req.body;
  const flower = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };

  Goblin.create({ garden, flower, nuvol: nuvolId })
    .then((newGoblin) => {
      return Nuvol.findByIdAndUpdate(nuvolId, {
        $push: { goblins: newGoblin._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the goblin", err);
      res.status(500).json({ message: "Error while creating the goblin" });
    });
});

// Update an existing goblin by ID
router.put("/goblins/:goblinId", upload.single("flower"), (req, res, next) => {
  const { garden } = req.body;
  const { goblinId } = req.params;
  const flower = {
    data: req.file.buffer,
    contentType: req.file.mimetype,
  };

  Goblin.findByIdAndUpdate(
    goblinId,
    { garden, flower },
    { new: true } // Returns the updated document
  )
    .then((updatedGoblin) => {
      if (!updatedGoblin) {
        return res.status(404).json({ message: "Goblin not found" });
      }
      res.json(updatedGoblin);
    })
    .catch((err) => {
      console.log("Error while updating the goblin", err);
      res.status(500).json({ message: "Error while updating the goblin" });
    });
});

// Delete an existing goblin by ID
router.delete("/goblins/:goblinId", (req, res, next) => {
  const { goblinId } = req.params;
  console.log("goblinId:", goblinId);

  Goblin.findByIdAndDelete(goblinId)
    .then((deletedGoblin) => {
      if (!deletedGoblin) {
        return res.status(404).json({ message: "Goblin not found" });
      }

      // Remove goblin ID from the associated nuvol
      return Nuvol.findByIdAndUpdate(deletedGoblin.nuvol, {
        $pull: { goblins: goblinId },
      });
    })
    .then(() => {
      res.json({ message: "Goblin deleted successfully" });
    })
    .catch((err) => {
      console.log("Error while deleting the goblin", err);
      res.status(500).json({ message: "Error while deleting the goblin" });
    });
});

module.exports = router;
