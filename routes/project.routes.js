// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const Project = require("../models/Project.model");
// const User = require("../models/User.model");
// const { isAuthenticated } = require("../middleware/jwt.middleware");

// // POST /api/projects - Creates a new project
// router.post("/projects", isAuthenticated, async (req, res, next) => {
//   try {
//     const { title, description, character, userId } = req.body;
//     const newProject = await Project.create({
//       title,
//       description,
//       character,
//       userId,
//     });

//     await User.findByIdAndUpdate(userId, {
//       $push: { createdProjects: newProject._id },
//     });

//     res.status(201).json(newProject);
//   } catch (error) {
//     res.json(error);
//     next(error);
//   }
// });

// // GET /api/projects - Retrieves all of the projects
// router.get("/projects", async (req, res, next) => {
//   try {
//     res.status(200).json(allProjects);
//   } catch (error) {
//     next(error);
//   }
// });

// // GET /api/projects - Retrieves all of the projects
// router.get("/projects", async (req, res, next) => {
//   try {
//     const allProjects = await Project.find({}); // Fetch projects from the database
//     res.status(200).json(allProjects);
//   } catch (error) {
//     next(error);
//   }
// });

// // GET /api/projects/:projectId - Retrieves a specific project by id
// router.get("/projects/:projectId", async (req, res, next) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }

//     const project = await Project.findById(projectId);

//     if (!project) {
//       res.status(404).json({ message: "Project not found" });
//       return;
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     next(error);
//   }
// });

// // PUT /api/projects/:projectId - Updates a specific project by id
// router.put("/projects/:projectId", isAuthenticated, async (req, res, next) => {
//   try {
//     const { projectId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(projectId)) {
//       res.status(400).json({ message: "Specified id is not valid" });
//       return;
//     }

//     const updatedProject = await Project.findByIdAndUpdate(
//       projectId,
//       req.body,
//       { new: true }
//     );

//     res.status(200).json(updatedProject);
//   } catch (error) {
//     next(error);
//   }
// });

// // DELETE /api/projects/:projectId - Deletes a specific project by id
// router.delete(
//   "/projects/:projectId",
//   isAuthenticated,
//   async (req, res, next) => {
//     try {
//       const { projectId } = req.params;

//       if (!mongoose.Types.ObjectId.isValid(projectId)) {
//         res.status(400).json({ message: "Specified id is not valid" });
//         return;
//       }

//       await Project.findByIdAndDelete(projectId);

//       res.status(200).json({
//         message: `Project with ${projectId} is removed successfully.`,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
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
    const allProjects = await Project.find({}); // Fetch projects from the database
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
