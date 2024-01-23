require("dotenv").config();

require("./db");

const cors = require("cors");
const { isAuthenticated } = require("./middleware/jwt.middleware");

const express = require("express");
const mongoose = require("mongoose");

const commentRoutes = require("./routes/comment.routes");

const app = express();

app.use(express.static("uploads"));
app.use("/uploads", express.static("uploads")); // Add this line to serve static files

app.use(cors());
app.use(express.json()); // Add this line to enable JSON parsing

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const projectRouter = require("./routes/project.routes");
app.use("/api", projectRouter);

app.use("/api/comments", commentRoutes);

const urgentProjectsRouter = require("./routes/urgent.routes");
app.use("/api", urgentProjectsRouter);

const nuvolRouter = require("./routes/nuvol.routes");
app.use("/api", nuvolRouter);

const objectiuRouter = require("./routes/objectiu.routes");
app.use("/api", objectiuRouter);

const fantasmaRouter = require("./routes/fantasma.routes");
app.use("/api", fantasmaRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);

module.exports = app;
