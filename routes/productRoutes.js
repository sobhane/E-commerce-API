const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productControllers");
const {
  authenticatedUser,
  authorizePermisssions,
} = require("../middleware/authentication");

const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .post([authenticatedUser, authorizePermisssions("admin")], createProduct)
  .get(authenticatedUser, getAllProducts);

router
  .route("/uploadImage")
  .post([authenticatedUser, authorizePermisssions("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticatedUser, authorizePermisssions("admin")], updateProduct)
  .delete([authenticatedUser, authorizePermisssions("admin")], deleteProduct);

router.route("/:id/review").get(getSingleProductReviews);
module.exports = router;
