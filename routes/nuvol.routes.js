const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Nuvol = require("../models/Nuvol.model");
const Fantasma = require("../models/Fantasma.model");

// POST /api/projects  -  Creates a new project
router.post("/nuvols", (req, res, next) => {
  const { papallona, cuc, userId } = req.body;

  Nuvol.create({ papallona, cuc, userId, fantasmes: [] })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the project", err);
      res.status(500).json({ message: "Error while creating the project" });
    });
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/nuvols", (req, res, next) => {
  Nuvol.find()
    .populate("fantasmes")

    .then((allNuvols) => res.json(allNuvols))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/nuvols/:nuvolId", (req, res, next) => {
  const { nuvolId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(nuvolId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Nuvol.findById(nuvolId)
    .populate("fantasmes")

    .then((nuvol) => res.status(200).json(nuvol))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/nuvols/:nuvolId", (req, res, next) => {
  const { nuvolId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(nuvolId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Nuvol.findByIdAndUpdate(nuvolId, req.body, { new: true })
    .then((updatedNuvol) => res.json(updatedNuvol))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/nuvols/:nuvolId", (req, res, next) => {
  const { nuvolId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(nuvolId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Nuvol.findByIdAndDelete(nuvolId)
    .then(() =>
      res.json({
        message: `Project with ${nuvolId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
