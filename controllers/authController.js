require("dotenv").config();
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils");

async function register(req, res) {
  const { email, name, password } = req.body;
  const emailUsed = await User.findOne({ email });

  if (emailUsed) {
    throw new CustomError.BadRequestError("this email already exists");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;

  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, role, password });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
}

async function login(req, res) {
  const { email, password } = req.body;
  //checking user input
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("invalid credatial");
  }

  const isPaswordCorrect = await user.comparePassword(password);

  if (!isPaswordCorrect) {
    throw new CustomError.UnauthenticatedError("invalid credatial");
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
}

async function logout(req, res) {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.send("logout user");
}

module.exports = {
  register,
  login,
  logout,
};
