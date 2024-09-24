import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order/order.model.js";
import { Product } from "../../models/product/product.model.js";
import { deleteCartItems } from "../cart/cart.controller.js";

const createOrder = asyncHandler(async (req, res, next) => {
  const { products, totalAmount, paymentMethod, shippingAddress } = req.body;

  if (!products || !totalAmount || !paymentMethod || !shippingAddress) {
    throw new ApiError(400, "Please provide all required order details");
  }

  const user = req.user?._id;
  if (!user) {
    throw new ApiError(403, "Unauthorized request");
  }

  const validatedProducts = [];
  let calculatedTotal = 0;

  for (const item of products) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new ApiError(404, `Product with ID ${item.product} not found`);
    }

    if (item.quantity < 1) {
      throw new ApiError(400, "Quantity must be at least 1");
    }

    validatedProducts.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
    });

    calculatedTotal += product.price * item.quantity;
  }

  if (calculatedTotal !== totalAmount) {
    throw new ApiError(400, "Total amount mismatch with product prices");
  }

  const order = await Order.create({
    user,
    products: validatedProducts,
    totalAmount: calculatedTotal,
    paymentMethod,
    shippingAddress,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create the order");
  }
  deleteCartItems(req, res, next);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export { createOrder };
