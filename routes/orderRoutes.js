const express = require("express");
const router = express.Router();

const {
  authenticatedUser,
  authorizePermisssions,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");
const { checkPremissions } = require("../utils");

router
  .route("/")
  .post(authenticatedUser, createOrder)
  .get([authenticatedUser, authorizePermisssions("admin")], getAllOrders);

router.route("/showAllMyOrder").get(authenticatedUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authenticatedUser, getSingleOrder)
  .patch(authenticatedUser, updateOrder);

module.exports = router;
