import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/product/product.model.js";
import { User } from "../../models/user/user.model.js";
import { Comment } from "../../models/product/comment.model.js";
import { Rating } from "../../models/product/rating.model.js";
import mongoose from "mongoose";
import { response } from "express";

const createAComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    throw new ApiError(400, "Write to make a comment on the product");
  }
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
  const commentOnAProduct = await Comment.create({
    product: productId,
    user: userId,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, commentOnAProduct, "Comment added successfuly"));
});

const getCurrentUserComment = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;
  if (!userId || !productId) {
    throw new ApiError(400, "User and Product Id's are required to proceed");
  }
  const comment = await Comment.find({
    user: userId,
    product: productId,
  });
  if (!comment) {
    throw new ApiError(404, "No Comment found for this product");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment fetched successfuly"));
});

const updateAComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  if (!comment) {
    throw new ApiError(400, "Write a comment to update");
  }

  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment Id is required to proceed");
  }

  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "Sign In to Proceed");
  }

  const commentToUpdate = await Comment.findOne({ _id: commentId });
  if (!commentToUpdate) {
    throw new ApiError(404, "Comment not found");
  }

  if (commentToUpdate.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { comment: comment },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong while updating the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const getAllCommentsOnAProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }
  const { page = 1, limit = 10 } = req.query;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const aggregateQuery = Comment.aggregate([
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
  const comments = await Comment.aggregatePaginate(aggregateQuery, options);

  const totalComments = await Comment.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalComments,
        comments: comments.docs,
        totalPages: comments.totalPages,
        currentPage: comments.page,
        hasNextPage: comments.hasNextPage,
      },
      "Product reviews fetched successfully"
    )
  );
});

const deleteAComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(400, "Comment Id is required to proceed");
  }
  const user = req.user?._id;
  if (!user) {
    throw new ApiError(400, "Sign In to proceed");
  }
  const commentToDelete = await Comment.findOne({ _id: commentId });
  if (!commentToDelete) {
    throw new ApiError(404, "Comment not found");
  }
  if (commentToDelete.user.toString() !== user.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }
  const deleteTheComment = await Comment.findOneAndDelete({ _id: commentId });
  if (!deleteTheComment) {
    throw new ApiError(500, "Something went wrong while deleting the comment");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, deleteTheComment, "Comment deleted successfuly")
    );
});

const createARating = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  if (!rating) {
    throw new ApiError(400, "Rating is required to proceed");
  }

  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }
  const user = req.user?._id
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  let rate = 0;
  rate = await Rating.findOne({
    product,
    user,
  });
  if (rate) {
    try {
      rate.rating = rating;
      await rate.save();
    } catch (error) {
      throw new ApiError(
        403,
        "You are not authorized to add this rating"
      );
    }
  } else {
    try {
      rate = await Rating.create({
        product: productId,
        user,
        rating,
      });
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while creating a new rating"
      );
    }
  }

  if (!rate) {
    throw new ApiError(500, "Something went wrong while rating the product");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, rate, "Rating added successfuly"));
});

const getCurrentUserRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }
  const user = req.user?._id;
  const rating = await Rating.findOne({
    product: productId,
    user,
  });
  if (!rating) {
    throw new ApiError(404, "No review found of this user for this product");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, rating, "Rating for the current user is fetched")
    );
});
const getAverageRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }
  const product = await Product.findOne({
    _id: productId,
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  const rating = await Rating.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalRating: { $sum: 1 },
      },
    },
  ]);
  if (!rating || rating.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        averageRating: 0,
        totalRating: 0,
      })
    );
  }
  const { averageRating, totalRating } = rating[0];
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        averageRating,
        totalRating,
      },
      "Average and Total Rating are fethced"
    )
  );
});


export {
  createAComment,
  getCurrentUserComment,
  getAllCommentsOnAProduct,
  updateAComment,
  deleteAComment,
  createARating,
  getCurrentUserRating,
  getAverageRating
};
