const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Nuvol = require("../models/Nuvol.model");
const Fantasma = require("../models/Fantasma.model");

router.post("/nuvols", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const { papallona, cuc } = req.body;
    const newNuvol = await Nuvol.create({
      papallona,
      cuc,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { createdNuvols: newNuvol._id },
    });

    res.status(201).json(newNuvol);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

router.get("/nuvols", (req, res, next) => {
  Nuvol.find()
    .populate("fantasmes")

    .then((allNuvols) => res.json(allNuvols))
    .catch((err) => res.json(err));
});

router.get("/nuvols/:nuvolId", (req, res, next) => {
  const { nuvolId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(nuvolId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Nuvol.findById(nuvolId)
    .populate("fantasmes")

    .then((nuvol) => res.status(200).json(nuvol))
    .catch((error) => res.json(error));
});

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
