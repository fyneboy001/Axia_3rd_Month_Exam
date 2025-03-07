const express = require("express");
const route = express.Router();
//import your controller functions inside an object
const {
  createUser,
  deleteUserAndPost,
  userLogin,
  createKyc,
} = require("../controller/userController");
const authorization = require("../middleware/authorization");

//creating route for the different functions(CRUD operators)
route.post("/user", createUser);
route.post("/login", userLogin);
route.delete("/user/:id", deleteUserAndPost);
route.post("/kyc", authorization, createKyc);
//exporting your route
module.exports = route;
