const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); // <== IMPORT

const router = express.Router(); // Move this line to the top

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where profile pictures will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});

const upload = multer({ storage });

// Upload endpoint for profile pictures
router.post(
  "/upload-profile-picture",
  isAuthenticated,
  upload.single("profilePicture"),
  (req, res) => {
    const userId = req.payload._id;

    // Save the file path to the user's profile picture field in the database
    const profilePicturePath = req.file.path;

    User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePicturePath },
      { new: true }
    )
      .then((updatedUser) => {
        res.status(200).json({
          message: "Profile picture uploaded successfully!",
          user: updatedUser,
        });
      })
      .catch((error) => {
        console.error("Error updating user with profile picture:", error);
        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      });
  }
);

router.put("/update-user-info", isAuthenticated, (req, res) => {
  const userId = req.payload._id;
  const { bio, location, birthday /* add more fields as needed */ } = req.body;

  User.findByIdAndUpdate(
    userId,
    { bio, location, birthday /* add more fields as needed */ },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json({
        message: "User information updated successfully!",
        user: updatedUser,
      });
    })
    .catch((error) => {
      console.error("Error updating user information:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    });
});

module.exports = router;

const saltRounds = 10;

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;

  if (email === "" || password === "" || name === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;

      const user = { email, name, _id };

      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, email, name, urgentedProjects } = foundUser;

        const payload = { _id, email, name, urgentedProjects };

        console.log("Signing Token with Secret:", process.env.TOKEN_SECRET);

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  try {
    console.log(`req.payload`, req.payload);
    res.status(200).json(req.payload);
  } catch (error) {
    console.error("Error in /auth/verify:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
