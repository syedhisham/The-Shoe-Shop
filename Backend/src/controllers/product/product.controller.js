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
const removeProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const productToDelete = await Product.findByIdAndDelete(productId);
  if (!productToDelete) {
    throw new ApiError(404, "Product not found");
  }

  if (productToDelete.images && productToDelete.images.length > 0) {
    const imageDeletionPromises = productToDelete.images.map((imageUrl) =>
      deleteFromCloudinary(imageUrl, "image")
    );
    const results = await Promise.all(imageDeletionPromises);

    if (results.some((result) => !result)) {
      throw new ApiError(
        500,
        "Some images could not be deleted from Cloudinary"
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, productToDelete, "Product deleted successfully")
    );
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const { name, description, price, sizes, colors, category, stock } = req.body;

  if (
    !name &&
    !description &&
    !price &&
    !sizes &&
    !colors &&
    !category &&
    !stock
  ) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (sizes) updateFields.sizes = sizes;
  if (colors) updateFields.colors = colors;
  if (category) updateFields.category = category;
  if (stock !== undefined) updateFields.stock = stock;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedProduct,
          "Product details updated successfully"
        )
      );
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new ApiError(400, "Invalid product data provided");
    }
    console.error("Error updating product details:", error);
    throw new ApiError(
      500,
      "Something went wrong while updating product details"
    );
  }
});

const updateProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const imagesLocalPath = req.files;

  if (!imagesLocalPath || imagesLocalPath.length === 0) {
    throw new ApiError(400, "No images selected to upload");
  }

  let imagesToUploadOnCloudinaryUrl;
  try {
    imagesToUploadOnCloudinaryUrl = await Promise.all(
      imagesLocalPath.map((file) => uploadOnCloudinary(file.path))
    );
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    throw new ApiError(500, "Failed to upload images to Cloudinary");
  }

  const productImagesToUpdate = await Product.findById(productId);
  if (!productImagesToUpdate) {
    throw new ApiError(404, "Product not found");
  }
  console.log("productImagesToUpdate url", productImagesToUpdate.images);

  const oldProductImages = productImagesToUpdate.images;

  productImagesToUpdate.images = imagesToUploadOnCloudinaryUrl;

  await productImagesToUpdate.save({ validateBeforeSave: false });
  console.log("Old Images path is ---->", oldProductImages.path);

  if (oldProductImages && oldProductImages.length > 0) {
    try {
      await Promise.all(
        oldProductImages.map((file) => deleteFromCloudinary(file, "image"))
      );
    } catch (error) {
      console.error("Error deleting old images from Cloudinary:", error);
      throw new ApiError(
        500,
        "Something went wrong while deleting the old images from Cloudinary"
      );
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        productImagesToUpdate,
        "Product images updated successfully"
      )
    );
});

export { addProduct, removeProduct, updateProductDetails, updateProductImages };
