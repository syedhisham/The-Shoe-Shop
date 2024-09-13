import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../models/cart/cart.model.js";
import { Product } from "../../models/product/product.model.js";
import { User } from "../../models/user/user.model.js";

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
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].size = defaultSize;
      cart.items[existingItemIndex].color = defaultColor;
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
const getCart = asyncHandler(async(req,res) => {
    const {cartId, userId} = req.params;
    if (!cartId || !userId) {
        throw new ApiError(400, "Cart Id is required to proceed")
    }
    const user = await User.findById(userId).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(404, "User not found")
    }
    const cart = await Cart.find({_id: cartId,user: user._id})
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }
    return res 
    .status(201)
    .json(
        new ApiResponse(
            201,
            cart,
            "Cart fetched successfuly"
        )
    )
})

export { createCart, getCart };
