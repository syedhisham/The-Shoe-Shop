import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/product/product.model.js";
import { User } from "../../models/user/user.model.js";
import { Review } from "../../models/product/review.model.js";
import mongoose from "mongoose";

const createAReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const defaultRating = rating || 4;
  const defaultComment = comment || "Nice Product";

  const { productId, userId } = req.params;
  if (!productId || !userId) {
    throw new ApiError(400, "Product and User Id's are required to proceed");
  }
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  let review = await Review.findOne({ user: user._id, product: product._id });
  if (review) {
    review.rating = defaultRating;
    review.comment = defaultComment;
    await review.save();
  } else {
    review = await Review.create({
      user: user._id,
      product: product._id,
      rating: defaultRating,
      comment: defaultComment,
    });
  }
  if (!review) {
    throw new ApiError(500, "Something went wrong while rating the product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Rating added successfuly"));
});

const getCurrentUserReview = asyncHandler(async (req, res) => {
  const { userId, productId, reviewId } = req.params;
  if (!userId || !productId || !reviewId) {
    throw new ApiError(
      400,
      "User, Product and Review Id's are required to proceed"
    );
  }
  const review = await Review.findOne({
    user: userId,
    product: productId,
    _id: reviewId,
  });
  if (!review) {
    throw new ApiError(404, "No review found for this product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review fetched successfuly"));
});

const getAllReviewsOnAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }
  const { page = 1, limit = 10 } = req.query;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const aggregateQuery = Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        product: 1,
        rating: 1,
        comment: 1,
        createdAt: 1,
        "user.firstName": 1,
        "user.lastName": 1,
      },
    },
  ]);
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };
  const reviews = await Review.aggregatePaginate(aggregateQuery, options);

  const avgRating = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  const averageRating = avgRating.length ? avgRating[0].avgRating : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalReviews: reviews.totalDocs,
        averageRating,
        reviews: reviews.docs,
        totalPages: reviews.totalPages,
        currentPage: reviews.page,
        hasNextPage: reviews.hasNextPage,
      },
      "Product reviews fetched successfully"
    )
  );
});

export { createAReview, getCurrentUserReview, getAllReviewsOnAProduct };
