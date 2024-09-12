import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";
import {
  addProduct,
  getAllProducts,
  getImageByColor,
  getImageById,
  getProductById,
  removeProduct,
  updateProductDetails,
  updateProductImagesAndColors,
} from "../../controllers/product/product.controller.js";

const router = Router();
// Routes
router.route("/all-products").get(getAllProducts);
router.route("/product-by-id/:productId").get(getProductById);
router.route("/image-by-id/:imageId").get(getImageById);
router.route("/image-by-color/:productId/:color").get(getImageByColor);
//Secure Routes
router
  .route("/add-product")
  .post(upload.array("images", 20), verifyAdmin, verifyJWT, addProduct);
router
  .route("/remove-product/:productId")
  .delete(verifyAdmin, verifyJWT, removeProduct);
router
  .route("/update-product-details/:productId")
  .patch(verifyAdmin, verifyJWT, updateProductDetails);
router
  .route("/update-product-images/:productId")
  .patch(
    upload.array("images", 20),
    verifyAdmin,
    verifyJWT,
    updateProductImagesAndColors
  );

export default router;
