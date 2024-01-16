const router = require("express").Router();
const User = require("../models/User.model");

router.post("/likes/:mountainId", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { mountainId } = req.params;
    await User.findByIdAndUpdate(userId, {
      $push: { likedMountains: mountainId },
    });
    res.status(200).json({ message: "Mountain liked successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/likedmountains:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userLikedMountains = await User.find().populate("likedMountains");
    res.status(200).json(userLikedMountains);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
