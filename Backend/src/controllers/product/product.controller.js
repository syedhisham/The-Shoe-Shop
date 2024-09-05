import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product/product.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    sizes = [],
    colors = [],
    category,
    stock,
  } = req.body;

  if (
    !name ||
    !description ||
    !price ||
    !sizes ||
    !colors ||
    !category ||
    !stock
  ) {
    throw new ApiError(401, "Enter all the details about the product");
  }

  const images = req.files;
  if (!images || images.length === 0) {
    throw new ApiError(401, "Images are required");
  }

  const uploadPromises = images.map((file) => uploadOnCloudinary(file.path));
  const uploadResults = await Promise.all(uploadPromises);

  const imageUrls = uploadResults.map((result) => result.url);

  const product = await Product.create({
    name,
    description,
    price,
    sizes,
    colors,
    category,
    stock,
    images: imageUrls,
  });

  if (!product) {
    throw new ApiError(500, "Something went wrong while adding the product");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product added successfully"));
});

export { addProduct };
