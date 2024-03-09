const path = require("node:path");

const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();

const courseRouter = require("./routes/courses_route");
const userRouter = require("./routes/user_route");
const httpStatuesText = require("./utils/http_statues_text");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: httpStatuesText.ERROR,
    message: "this resource is not available",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatuesText.ERROR,
    code: error.statusCode || 500,
    message: error.message || "Error",
    data: error.data || null,
  });
});

app.listen(process.env.PORT, () => {
  console.log("listening on port 4000");
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Mongoose server started");
});
