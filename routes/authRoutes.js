const { login, register, logout } = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);

module.exports = router;
