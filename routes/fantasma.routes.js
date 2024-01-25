const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Fantasma = require("../models/Fantasma.model");
const Nuvol = require("../models/Nuvol.model");

router.post("/fantasmes", (req, res, next) => {
  const { title, description, nuvolId } = req.body;

  Fantasma.create({ title, description, nuvol: nuvolId })
    .then((newFantasma) => {
      return Nuvol.findByIdAndUpdate(nuvolId, {
        $push: { fantasmes: newFantasma._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the fantasma", err);
      res.status(500).json({ message: "Error while creating the fantasma" });
    });
});
// Update an existing fantasma by ID
router.put("/fantasmes/:fantasmaId", (req, res, next) => {
  const { title, description } = req.body;
  const { fantasmaId } = req.params;

  Fantasma.findByIdAndUpdate(
    fantasmaId,
    { title, description },
    { new: true } // Returns the updated document
  )
    .then((updatedFantasma) => {
      if (!updatedFantasma) {
        return res.status(404).json({ message: "Fantasma not found" });
      }
      res.json(updatedFantasma);
    })
    .catch((err) => {
      console.log("Error while updating the fantasma", err);
      res.status(500).json({ message: "Error while updating the fantasma" });
    });
});

// Delete an existing fantasma by ID
router.delete("/fantasmes/:fantasmaId", (req, res, next) => {
  const { fantasmaId } = req.params;

  Fantasma.findByIdAndDelete(fantasmaId)
    .then((deletedFantasma) => {
      if (!deletedFantasma) {
        return res.status(404).json({ message: "Fantasma not found" });
      }

      // Remove fantasma ID from the associated nuvol
      return Nuvol.findByIdAndUpdate(deletedFantasma.nuvol, {
        $pull: { fantasmes: fantasmaId },
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
