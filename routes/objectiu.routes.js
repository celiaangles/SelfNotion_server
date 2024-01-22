const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Objectiu = require("../models/Objectiu.model");

router.post("/objectius", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const { serp, mico } = req.body;
    const newObjectiu = await Objectiu.create({
      serp,
      mico,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { createdObjectius: newObjectiu._id },
    });

    res.status(201).json(newObjectiu);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

router.get("/objectius", async (req, res, next) => {
  try {
    const allObjectius = await Objectiu.find({});
    res.status(200).json(allObjectius);
  } catch (error) {
    next(error);
  }
});

router.get("/objectius/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Objectiu.findById(objectiuId)
    .then((objectiu) => {
      if (!objectiu) {
        res.status(404).json({ message: "Objectiu not found" });
        return;
      }

      const isValid = objectiu.isValid;
      res.status(200).json(objectiu);
    })
    .catch((error) => res.status(500).json(error));
});

router.put("/objectius/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Objectiu.findByIdAndUpdate(objectiuId, req.body, { new: true })
    .then((updatedObjectiu) => res.json(updatedObjectiu))
    .catch((error) => res.json(error));
});

router.delete("/objectius/:objectiuId", (req, res, next) => {
  const { objectiuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(objectiuId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Objectiu.findByIdAndDelete(objectiuId)
    .then(() =>
      res.json({
        message: `Project with ${objectiuId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
