import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product/product.model.js";
import { Image } from "../../models/product/image.model.js";
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
    stock,
  } = req.body;

  const colors = req.body.colors || [];
  const images = req.files || [];

  if (!name || !price || colors.length === 0 || !category || !stock) {
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
    stock,
  });
  const savedProduct = await product.save();

  const saveImageUrl = resultOfUploadImagesOnCloudinary.map(
    (uploadedImage, index) => ({
      productId: savedProduct._id,
      color: colors[index], // Assign color from the colors array
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

  if (
    !name &&
    !description &&
    price === undefined &&
    !Array.isArray(sizes) &&
    !Array.isArray(availableColors) &&
    !category &&
    !stock
  ) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (description) updateFields.description = description;
  if (price !== undefined) updateFields.price = price;
  if (Array.isArray(sizes)) updateFields.sizes = sizes;
  if (Array.isArray(availableColors)) updateFields.colors = availableColors;
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

const updateCurrentProductImageAndColor = asyncHandler(async (req, res) => {
  const { color } = req.body;
  if (!color) {
    throw new ApiError(400, "Enter the color of the image");
  }

  const { imageId } = req.params;
  if (!imageId) {
    throw new ApiError(400, "Select the image to update");
  }

  const imageFile = req.file;
  if (!imageFile) {
    throw new ApiError(400, "Select an image to update");
  }

  let uploadCurrentImageOnCloudinary;
  try {
    uploadCurrentImageOnCloudinary = await uploadOnCloudinary(imageFile.path);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new ApiError(
      500,
      "Something went wrong while uploading the image to Cloudinary"
    );
  }

  if (!uploadCurrentImageOnCloudinary) {
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }

  const oldImage = await Image.findById(imageId);
  if (!oldImage) {
    throw new ApiError(404, "Image not found");
  }

  const imageToDelete = oldImage.imageUrl;

  if (imageToDelete && imageToDelete.length !== 0) {
    try {
      await deleteFromCloudinary(imageToDelete, "image");
    } catch (error) {
      console.error("Error deleting old image from Cloudinary:", error);
      throw new ApiError(
        500,
        "Something went wrong while deleting the old image from Cloudinary"
      );
    }
  }

  let imageAndColorToUpdate;
  try {
    imageAndColorToUpdate = await Image.findByIdAndUpdate(
      imageId,
      {
        color,
        imageUrl: uploadCurrentImageOnCloudinary.url,
      },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating image and color in database:", error);
    throw new ApiError(
      500,
      "Something went wrong while updating the image and color in the database"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        imageAndColorToUpdate,
        "Image and its color updated successfully"
      )
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const allProducts = await Product.aggregate([
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
          stock: { $first: "$stock" },
          images: { $push: "$productImages.imageUrl" },
          totalImagesCount: { $sum: 1 },
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
          category: 1,
          stock: 1,
          images: 1,
          totalImagesCount: 1,
        },
      },
    ]);

    if (!allProducts || allProducts.length === 0) {
      throw new ApiError(404, "No products found");
    }
    const totalNumberOfProducts = await Product.countDocuments();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          TotalProducts: totalNumberOfProducts,
          ProductDetails: allProducts,
        },
        "All products and their images are fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching products and images:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching products and images"
    );
  }
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
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "productCategory",
      },
    },
    {
      $unwind: "$productCategory",
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
        category: {
          name: "$productCategory.name",
          description: "$productCategory.description",
        },
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

export {
  addProduct,
  removeProduct,
  updateProductDetails,
  updateProductImagesAndColors,
  updateCurrentProductImageAndColor,
  getAllProducts,
  getProductById,
  getImageById,
};
