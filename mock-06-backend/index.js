const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/userRoutes");
const { blogRouter } = require("./routes/blogRoutes"); // Import the blog router
const { auth } = require("./middleware/authMiddleware");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);

app.use("/blogs", auth, blogRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log(err);
    console.log("Cannot connect to the DB");
  }
  console.log(`Server is running at port ${process.env.PORT}`);
});