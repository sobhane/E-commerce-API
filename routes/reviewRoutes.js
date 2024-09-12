const express = require("express");
const router = express.Router();

const { authenticatedUser } = require("../middleware/authentication");
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.route("/").post(authenticatedUser, createReview).get(getAllReviews);
router
  .route("/:id")
  .get(authenticatedUser, getSingleReview)
  .patch(authenticatedUser, updateReview)
  .delete(authenticatedUser, deleteReview);

module.exports = router;
