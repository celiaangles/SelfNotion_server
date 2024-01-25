const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Goblin = require("../models/Goblin.model");
const Nuvol = require("../models/Nuvol.model");

router.post("/goblins", (req, res, next) => {
  const { garden, flower, nuvolId } = req.body;

  Goblin.create({ garden, flower, nuvol: nuvolId })
    .then((newGoblin) => {
      return Nuvol.findByIdAndUpdate(nuvolId, {
        $push: { goblins: newGoblin._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the fantasma", err);
      res.status(500).json({ message: "Error while creating the fantasma" });
    });
});
// Update an existing fantasma by ID
router.put("/goblins/:goblinId", (req, res, next) => {
  const { garden, flower } = req.body;
  const { goblinId } = req.params;

  Goblin.findByIdAndUpdate(
    goblinId,
    { garden, flower },
    { new: true } // Returns the updated document
  )
    .then((updatedGoblin) => {
      if (!updatedGoblin) {
        return res.status(404).json({ message: "Fantasma not found" });
      }
      res.json(updatedGoblin);
    })
    .catch((err) => {
      console.log("Error while updating the fantasma", err);
      res.status(500).json({ message: "Error while updating the fantasma" });
    });
});

// Delete an existing fantasma by ID
router.delete("/goblins/:goblinId", (req, res, next) => {
  const { goblinId } = req.params;
  console.log("goblinId:", goblinId);

  Goblin.findByIdAndDelete(goblinId)
    .then((deletedGoblin) => {
      if (!deletedGoblin) {
        return res.status(404).json({ message: "Fantasma not found" });
      }

      // Remove fantasma ID from the associated nuvol
      return Nuvol.findByIdAndUpdate(deletedGoblin.nuvol, {
        $pull: { goblins: goblinId },
      });
    })
    .then(() => {
      res.json({ message: "Fantasma deleted successfully" });
    })
    .catch((err) => {
      console.log("Error while deleting the fantasma", err);
      res.status(500).json({ message: "Error while deleting the fantasma" });
    });
});

module.exports = router;
