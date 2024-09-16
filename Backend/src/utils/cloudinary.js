import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "the-shoe-shop-products",
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
const deleteFromCloudinary = async (url, resourceType = "auto") => {
  try {
    const publicIdWithFolder = url.split("/").slice(-2).join("/").split(".")[0];

    const response = await cloudinary.uploader.destroy(publicIdWithFolder, {
      resource_type: resourceType,
    });

    if (response.result === "ok") {
      return response;
    } else {
      throw new Error(
        `Failed to delete resource. Response: ${response.result}`
      );
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Failed to delete from Cloudinary.");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
