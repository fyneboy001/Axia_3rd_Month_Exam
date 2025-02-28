const userModel = require("../model/userModel");
const postModel = require("../model/postModel");
const kycModel = require("../model/kycModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Create the createUser function
const createUser = async (req, res) => {
  const { password, ...others } = req.body;
  //salt the password for hashing
  const salt = bcrypt.genSaltSync(10);

  //Hashing the password passed from the frontend
  const hashPassword = await bcrypt.hash(password, salt);
  console.log(hashPassword);

  //validating if the email sent from the frontend already exist
  const checkUserEmail = await userModel.findOne({ email: others.email });
  if (checkUserEmail) {
    return res.status(409).json("User already exist");
  }

  //using try save the user information and catch error by sending a message back if something goes wrong
  try {
    const newUser = new userModel({ password: hashPassword, ...others });
    await newUser.save();
    return res.status(200).json("User account created successfully");
  } catch (error) {
    return res.status(400).json("Unable to create account");
  }
};

//function to login user
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  //Check if email and password matches
  if (!email || !password) {
    return res.status(400).json("provide valid credentials");
  }

  //Check if user has an account
  const checkUser = await userModel.findOne({ email });
  if (!checkUser) {
    return res.status(404).json("User does not exist: Create an account");
  }

  //check if password is correct
  const checkPassword = bcrypt.compareSync(password, checkUser.password);
  console.log(checkPassword);
  if (!checkPassword) {
    return res.status(400).json("Invalid password");
  }
  //create jwt token
  const token = jwt.sign({ id: checkUser.id }, process.env.JWT_SECRET);
  console.log(token);

  //Return user's information
  return res
    .cookie("token", token, { httpOnly: true })
    .status(200)
    .json(checkUser);
};

//function to create kyc
const createKyc = async (req, res) => {
  const body = req.body;
  const user = req.user;

  try {
    //create the kyc
    const kyc = new kycModel({ ...body, user });
    const saveKyc = await kyc.save();

    //update the user model kyc field
    await userModel.findByIdAndUpdate(user, { kyc: saveKyc.id }, { new: true });
    res.send("kyc created successfully");
  } catch (error) {
    res.send("something went wrong");
  }
};

const deleteUserAndPost = async (req, res) => {
  const { token } = req.cookies;

  try {
    //command to delete users post first
    await postModel.findByIdAndDeleteMany(token);
    //const user = await userModel.findByIdAndDelete(id);

    //command to delete user's kyc next
    await kycModel.findByIdAndDeleteOne(token);

    //command to finally delete user account
    await userModel.findByIdAndDeleteOne(token);
    //successful message
    res.status(200).send("User Account Deleted Successfully");
  } catch (error) {
    res.status(500).send("something went wrong");
  }
};
//export all functions
module.exports = { createUser, userLogin, deleteUserAndPost, createKyc };
