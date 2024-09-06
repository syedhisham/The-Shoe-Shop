import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";
import {
  addProduct,
  removeProduct,
  updateProductDetails,
  updateProductImages,
} from "../../controllers/product/product.controller.js";

const router = Router();

router
  .route("/add-product")
  .post(upload.array("images", 4), verifyAdmin, verifyJWT, addProduct);
router
  .route("/remove-product/:productId")
  .delete(verifyAdmin, verifyJWT, removeProduct);
router
  .route("/update-product-details/:productId")
  .patch(verifyAdmin, verifyJWT, updateProductDetails);
router
  .route("/update-product-images/:productId")
  .patch(
    upload.array("images", 4),
    verifyAdmin,
    verifyJWT,
    updateProductImages
  );

export default router;
