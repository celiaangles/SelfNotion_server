// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const User = require("../models/User.model");

// const Project = require("../models/Project.model");
// const Task = require("../models/Task.model");

// //  POST /api/projects  -  Creates a new project
// router.post("/projects", (req, res, next) => {
//   const { title, description, character, userId } = req.body; // Added userId

//   Project.create({ title, description, character, userId, tasks: [] }) // Added userId
//     .then((response) => res.json(response))
//     .catch((err) => res.json(err));
// });

// //  GET /api/projects -  Retrieves all of the projects
// router.get("/projects", (req, res, next) => {
//   Project.find()
//     .populate("tasks")
//     .then((allProjects) => res.json(allProjects))
//     .catch((err) => res.json(err));
// });

// //  GET /api/projects/:projectId -  Retrieves a specific project by id
// router.get("/projects/:projectId", (req, res, next) => {
//   const { projectId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     res.status(400).json({ message: "Specified id is not valid" });
//     return;
//   }

//   // Each Project document has `tasks` array holding `_id`s of Task documents
//   // We use .populate() method to get swap the `_id`s for the actual Task documents
//   Project.findById(projectId)
//     .populate("tasks")
//     .then((project) => res.status(200).json(project))
//     .catch((error) => res.json(error));
// });

// // PUT  /api/projects/:projectId  -  Updates a specific project by id
// router.put("/projects/:projectId", (req, res, next) => {
//   const { projectId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     res.status(400).json({ message: "Specified id is not valid" });
//     return;
//   }

//   Project.findByIdAndUpdate(projectId, req.body, { new: true })
//     .then((updatedProject) => res.json(updatedProject))
//     .catch((error) => res.json(error));
// });

// // DELETE  /api/projects/:projectId  -  Deletes a specific project by id
// router.delete("/projects/:projectId", (req, res, next) => {
//   const { projectId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     res.status(400).json({ message: "Specified id is not valid" });
//     return;
//   }

//   Project.findByIdAndDelete(projectId)
//     .then(() =>
//       res.json({
//         message: `Project with ${projectId} is removed successfully.`,
//       })
//     )
//     .catch((error) => res.json(error));
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const Task = require("../models/Task.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// POST /api/projects - Creates a new project
router.post("/projects", isAuthenticated, async (req, res, next) => {
  try {
    const { title, description, character, userId } = req.body;
    const newProject = await Project.create({
      title,
      description,
      character,
      userId,
      tasks: [],
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

// GET /api/projects - Retrieves all of the projects
router.get("/projects", async (req, res, next) => {
  try {
    const allProjects = await Project.find().populate("tasks");
    res.status(200).json(allProjects);
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:projectId - Retrieves a specific project by id
router.get("/projects/:projectId", async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const project = await Project.findById(projectId).populate("tasks");

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

// PUT /api/projects/:projectId - Updates a specific project by id
router.put("/projects/:projectId", isAuthenticated, async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/projects/:projectId - Deletes a specific project by id
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
