const router = require("express").Router();
const User = require("../models/User.model");

router.post("/urgents", async (req, res, next) => {
  try {
    const { userId, projectIds } = req.body; // projectIds should be an array of project IDs
    await User.findByIdAndUpdate(userId, {
      $push: { urgentedProjects: { $each: projectIds } },
    });
    res.status(200).json({ message: "Mountain liked successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/urgentedprojects/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("urgentedProjects");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.urgentedProjects);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
