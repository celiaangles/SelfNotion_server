const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.post("/projects", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const { title, description, phone } = req.body;
    const newProject = await Project.create({
      title,
      description,
      phone,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { createdProjects: newProject._id },
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.json(error);
    next(error);
  }
});

router.get("/projects", async (req, res, next) => {
  try {
    const allProjects = await Project.find({});
    res.status(200).json(allProjects);
  } catch (error) {
    next(error);
  }
});

router.get("/projects/:projectId", async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

router.put("/projects/:projectId", isAuthenticated, async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.payload._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    // Assuming you want to ensure that the user can only update their own projects
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Check if the user is the owner of the project
    if (project.userId.toString() !== userId.toString()) {
      res
        .status(403)
        .json({ message: "You do not have permission to update this project" });
      return;
    }

    const { title, description, phone } = req.body;

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title,
        description,
        phone,
      },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
});

router.delete(
  "/projects/:projectId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { projectId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
      }

      await Project.findByIdAndDelete(projectId);

      res.status(200).json({
        message: `Project with ${projectId} is removed successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
