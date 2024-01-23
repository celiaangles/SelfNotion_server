// const app = require("./app");

// const PORT = process.env.PORT || 5005;

// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

const app = require("./app");
const cors = require("cors");

// Use cors middleware with specific origin
app.use(
  cors({
    origin: "http://localhost:5173",
    // You can add more options here if needed
  })
);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
