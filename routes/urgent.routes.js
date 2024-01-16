const router = require("express").Router();
const User = require("../models/User.model");

router.post("/urgents/:projectId", async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;
    await User.findByIdAndUpdate(userId, {
      $push: { urgentedProjects: projectId },
    });
    res.status(200).json({ message: "Mountain liked successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/urgentedprojects/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userUrgentedProjects = await User.find().populate("urgentedProjects");

    res.status(200).json(userUrgentedProjects);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
