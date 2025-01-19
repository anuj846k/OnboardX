const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const employeeRoutes = require("./src/routes/employeeRoutes");

dotenv.config({ path: "./.env" });
const app = express();
const DB= process.env.MONGO_URI
app.use(express.json());

// Routes
app.use("/api", employeeRoutes);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
  });

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

