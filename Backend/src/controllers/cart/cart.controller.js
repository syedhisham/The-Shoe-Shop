import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../models/cart/cart.model.js";
import { Product } from "../../models/product/product.model.js";
import { User } from "../../models/user/user.model.js";
import mongoose from "mongoose";

const createCart = asyncHandler(async (req, res) => {
  const { quantity, size, color } = req.body;
  const { productId, userId } = req.params;

  if (!quantity) {
    throw new ApiError(400, "Select the quantity to proceed");
  }

  if (!productId || !userId) {
    throw new ApiError(400, "Product and User ID's are required to proceed");
  }

  const defaultSize = size || "39";
  const defaultColor = color || "Black";

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: user._id });

  if (cart) {
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.color === defaultColor &&
        item.size === defaultSize
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        size: defaultSize,
        color: defaultColor,
      });
    }

    await cart.save();
  } else {
    cart = await Cart.create({
      user: user._id,
      items: [
        {
          product: product._id,
          quantity,
          size: defaultSize,
          color: defaultColor,
        },
      ],
    });
  }

  if (!cart) {
    throw new ApiError(
      500,
      "Something went wrong while creating/updating the cart"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(201, cart, "Cart created/updated successfully"));
});

const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "User ID is required to proceed");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const cart = await Cart.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$productDetails",
    },
    {
      $lookup: {
        from: "images",
        let: { productId: "$productDetails._id", productColor: "$items.color" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$productId", "$$productId"] },
                  { $eq: ["$color", "$$productColor"] },
                ],
              },
            },
          },
        ],
        as: "productImages",
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        items: {
          $push: {
            product: "$items.product",
            quantity: "$items.quantity",
            size: "$items.size",
            color: "$items.color",
            productDetails: "$productDetails",
            productImages: "$productImages",
          },
        },
      },
    },
  ]);

  if (!cart || cart.length === 0) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart[0], "Cart fetched successfully"));
});

export { createCart, getCart };
