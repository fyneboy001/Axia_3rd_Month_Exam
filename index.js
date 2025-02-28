const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRoute = require("./route/userRoute");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(userRoute);

//Connecting express app to mongodb database
const { MONGODB_URL } = process.env;

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to database successfully");
  })
  .catch(() => {
    console.log("Something went wrong");
  });

//using the route

app.listen(6000, () => {
  console.log("app is running effectively");
});
