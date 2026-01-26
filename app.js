const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", require("./routes/admin"));
mongoose
  .connect(process.env.DB)
  .then(() => console.log("connected to database"))
  .catch((err) => console.error("❌ DB connection error:", err));

module.exports = app;
