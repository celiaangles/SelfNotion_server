const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Nuvol = require("../models/Objectiu.model");

//  POST /api/projects  -  Creates a new project
router.post("/objectius", (req, res, next) => {
  const { serp, mico } = req.body;

  Nuvol.create({ serp, mico })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/projects -  Retrieves all of the projects
router.get("/objectius", (req, res, next) => {
  Objectiu.find()
    .then((allObjectius) => res.json(allObjectius))
    .catch((err) => res.json(err));
});

//  GET /api/projects/:projectId -  Retrieves a specific project by id
router.get("/objectius/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Each Project document has `tasks` array holding `_id`s of Task documents
  // We use .populate() method to get swap the `_id`s for the actual Task documents
  Nuvol.findById(objectiuId)
    .then((objectiu) => res.status(200).json(objectiu))
    .catch((error) => res.json(error));
});

// PUT  /api/projects/:projectId  -  Updates a specific project by id
router.put("/objectius/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Nuvol.findByIdAndUpdate(objectiuId, req.body, { new: true })
    .then((updatedObjectiu) => res.json(updatedObjectiu))
    .catch((error) => res.json(error));
});

// DELETE  /api/projects/:projectId  -  Deletes a specific project by id
router.delete("/objectiu/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndRemove(objectiuId)
    .then(() =>
      res.json({
        message: `Project with ${objectiuId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
