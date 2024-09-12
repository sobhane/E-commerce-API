const Review = require("../models/Review");
const Product = require("../models/Product");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPremissions,
} = require("../utils");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user.userId;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No Prduct with Id: ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  
  const allReviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name ",
    });
  res.status(StatusCodes.OK).json({ allReviews, count: allReviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No teview with id: ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No Review with id: ${reviewId}`);
  }

  checkPremissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No Review with id: ${reviewId}`);
  }

  checkPremissions(req.user, review.user);

  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Review deleted" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews
};
