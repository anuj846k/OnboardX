const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const employeeRoutes = require("./routes/employeeRoutes");
const documentRoutes = require("./routes/documentRoutes");
dotenv.config({ path: "./.env" });
const app = express();
const DB = process.env.MONGO_URI;
app.use(express.json());

// Routes
app.use("/api", employeeRoutes);
app.use("/api", documentRoutes);

app.get("/api", (req, res) => {
  res.send("welcome to onboardX api");
});

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(`Error while connecting to database: ${err}`);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
