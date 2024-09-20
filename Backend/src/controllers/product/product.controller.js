import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product/product.model.js";
import { Image } from "../../models/product/image.model.js";
import { Rating } from "../../models/product/rating.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";
import mongoose from "mongoose";

const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    sizes = [],
    availableColors = [],
    category,
    subcategory,
    stock,
  } = req.body;

  const colors = req.body.colors || [];
  const images = req.files || [];

  if (
    !name ||
    !price ||
    colors.length === 0 ||
    !category ||
    !stock ||
    !subcategory
  ) {
    throw new ApiError(400, "Fill the required fields");
  }
  if (!images || images.length === 0) {
    throw new ApiError(400, "Images are required");
  }
  if (images.length !== colors.length) {
    throw new ApiError(400, "Number of colors must match number of images");
  }

  const uploadPromises = images.map((file) => uploadOnCloudinary(file.path));
  const resultOfUploadImagesOnCloudinary = await Promise.all(uploadPromises);

  const product = new Product({
    name,
    description,
    price,
    sizes,
    colors: availableColors,
    category,
    subcategory,
    stock,
  });
  const savedProduct = await product.save();

  const saveImageUrl = resultOfUploadImagesOnCloudinary.map(
    (uploadedImage, index) => ({
      productId: savedProduct._id,
      color: colors[index],
      imageUrl: uploadedImage.url,
    })
  );

  const insertImages = await Image.insertMany(saveImageUrl);

  savedProduct.images = insertImages.map((image) => image._id);
  await savedProduct.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { savedProduct, insertImages },
        "Product added successfully"
      )
    );
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

  const productImagesToDelete = await Image.find({ productId });
  if (!productImagesToDelete || productImagesToDelete.length === 0) {
    throw new ApiError(500, "No images found for this product");
  }

  const imageDeletionPromises = productImagesToDelete.map((image) =>
    deleteFromCloudinary(image.imageUrl, "image")
  );

  const results = await Promise.all(imageDeletionPromises);

  if (results.some((result) => !result)) {
    throw new ApiError(500, "Some images could not be deleted from Cloudinary");
  }

  await Image.deleteMany({ productId });

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

  const {
    name,
    description,
    price,
    sizes = [],
    availableColors = [],
    category,
    stock,
  } = req.body;

  const hasFieldsToUpdate =
    name ||
    description ||
    price !== undefined ||
    sizes.length > 0 ||
    availableColors.length > 0 ||
    category ||
    stock !== undefined;

  if (!hasFieldsToUpdate) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (Array.isArray(sizes) && sizes.length > 0) updateFields.sizes = sizes;
  if (Array.isArray(availableColors) && availableColors.length > 0)
    updateFields.availableColors = availableColors;
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
      console.error("Validation error details:", error.errors);
      throw new ApiError(400, "Invalid product data provided");
    }
    console.error("Error updating product details:", error);
    throw new ApiError(
      500,
      "Something went wrong while updating product details"
    );
  }
});
const updateProductImagesAndColors = asyncHandler(async (req, res) => {
  const colors = req.body.colors || [];
  if (!colors || colors.length === 0) {
    throw new ApiError(400, "Color should be selected for each product image");
  }

  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  const imagesLocalPath = req.files;
  if (!imagesLocalPath || imagesLocalPath.length === 0) {
    throw new ApiError(400, "No images selected to upload");
  }

  if (colors.length !== imagesLocalPath.length) {
    throw new ApiError(400, "Each image must have a corresponding color");
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

  const productImagesToUpdate = await Image.find({ productId });
  if (!productImagesToUpdate || productImagesToUpdate.length === 0) {
    throw new ApiError(404, "No images found for this product");
  }

  const oldProductImagesUrls = productImagesToUpdate.map(
    (image) => image.imageUrl
  );

  if (oldProductImagesUrls && oldProductImagesUrls.length > 0) {
    try {
      await Promise.all(
        oldProductImagesUrls.map((imageUrl) =>
          deleteFromCloudinary(imageUrl, "image")
        )
      );
    } catch (error) {
      console.error("Error deleting old images from Cloudinary:", error);
      throw new ApiError(
        500,
        "Something went wrong while deleting the old images from Cloudinary"
      );
    }
  }

  await Image.deleteMany({ productId });

  const productImagesAndColorsToUpdate = imagesToUploadOnCloudinaryUrl.map(
    (uploadedImage, index) => ({
      productId,
      color: colors[index],
      imageUrl: uploadedImage.url,
    })
  );

  let insertImagesAndColors;
  try {
    insertImagesAndColors = await Image.insertMany(
      productImagesAndColorsToUpdate
    );
  } catch (error) {
    console.error("Error inserting new images into the database:", error);
    throw new ApiError(500, "Failed to save new product images");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        insertImagesAndColors,
        "Product images and their corresponding colors are updated successfully"
      )
    );
});
const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sortBy]: sortType === "desc" ? -1 : 1 },
  };

  const aggregateQuery = Product.aggregate([
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "productId",
        as: "productImages",
      },
    },
    {
      $unwind: {
        path: "$productImages",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        sizes: { $first: "$sizes" },
        colors: { $first: "$colors" },
        category: { $first: "$category" },
        subcategory: { $first: "$subcategory" },
        stock: { $first: "$stock" },
        images: { $push: "$productImages.imageUrl" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        totalImagesCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        sizes: 1,
        colors: 1,
        category: 1,
        subcategory: 1,
        stock: 1,
        images: 1,
        createdAt: 1,
        updatedAt: 1,
        totalImagesCount: 1,
      },
    },
  ]);

  const result = await Product.aggregatePaginate(aggregateQuery, options);

  if (!result.docs || result.docs.length === 0) {
    throw new ApiError(404, "No products found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        TotalProducts: result.totalDocs,
        ProductsPerPage: result.limit,
        TotalPages: result.totalPages,
        CurrentPage: result.page,
        ProductDetails: result.docs,
      },
      "Products fetched successfully with pagination"
    )
  );
});
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Enter the product Id to proceed");
  }
  const product = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "productId",
        as: "productImage",
      },
    },
    {
      $unwind: {
        path: "$productImage",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "_id",
        totalImagesCount: { $sum: 1 },
        name: { $first: "$name" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        sizes: { $first: "$sizes" },
        colors: { $first: "$colors" },
        images: { $push: "$productImage.imageUrl" },
        stock: { $first: "$stock" },
        category: { $first: "$category" },
        subcategory: { $first: "$subcategory" },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        description: 1,
        price: 1,
        sizes: 1,
        colors: 1,
        images: 1,
        stock: 1,
        category: 1,
        subcategory: 1,
        totalImagesCount: 1,
      },
    },
  ]);
  if (!product || product.length === 0) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, `Product with Id: ${productId} is fetched`)
    );
});
const getImageById = asyncHandler(async (req, res) => {
  const { imageId } = req.params;
  if (!imageId) {
    throw new ApiError(400, "Enter Image Id to proceed");
  }
  const image = await Image.findById(imageId);
  if (!image) {
    throw new ApiError(404, "Image not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, image, `Image of Id: ${imageId} is fetched`));
});
const getImageByColor = asyncHandler(async (req, res) => {
  const { color, productId } = req.params;
  if (!color || !productId) {
    throw new ApiError(400, "Enter the color to fetch the image");
  }

  const getImageByColor = await Image.find({ productId, color });
  if (!getImageByColor || getImageByColor.length === 0) {
    throw new ApiError(404, "No Image found for this color");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getImageByColor,
        "Image for the corresponding color is fetched"
      )
    );
});
const getColorsWithImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product Id is required to proceed");
  }

  const productImages = await Image.find({ productId })
    .sort({ createdAt: 1 })
    .exec();
  if (!productImages) {
    throw new ApiError(404, "No Images found for this product");
  }

  const colorMap = productImages.reduce((acc, image) => {
    if (!acc[image.color]) {
      acc[image.color] = image;
    }
    return acc;
  }, {});

  const colorsWithImages = Object.keys(colorMap).map((color) => ({
    color,
    imageUrl: colorMap[color].imageUrl,
  }));

  return res.status(200).json({
    success: true,
    data: colorsWithImages,
    message: "Colors with their first images fetched successfully",
  });
});
const getAllTheImagesByColor = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    throw new ApiError(400, "Product id is required to proceed");
  }
  const { color } = req.query;
  if (!color) {
    throw new ApiError(400, "Color is required to proceed");
  }
  const imagesByColor = await Image.find({ productId, color });
  if (!imagesByColor) {
    throw new ApiError(404, "No images found for this color");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, imagesByColor, "All the images by color are fetched")
    );
});
const getMostRatedProducts = asyncHandler(async (req, res) => {
  const mostRatedProducts = await Rating.aggregate([
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 8,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
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
        localField: "_id",
        foreignField: "productId",
        as: "imagesDetails",
      },
    },
    {
      $unwind: {
        path: "$imagesDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        product: { $first: "$productDetails" },
        averageRating: { $first: "$averageRating" },
        images: { $push: "$imagesDetails.imageUrl" },
      },
    },
    {
      $project: {
        _id: 0,
        product: 1,
        averageRating: 1,
        images: 1,
      },
    },
  ]);

  if (mostRatedProducts.length === 0) {
    throw new ApiError(404, "No Ratings found for any product");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, mostRatedProducts, "Most Rated products are fetched")
    );
});

export {
  addProduct,
  removeProduct,
  updateProductDetails,
  updateProductImagesAndColors,
  getAllProducts,
  getProductById,
  getImageById,
  getImageByColor,
  getColorsWithImages,
  getAllTheImagesByColor,
  getMostRatedProducts,
};
