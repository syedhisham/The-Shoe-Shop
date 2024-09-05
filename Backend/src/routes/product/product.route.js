import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/multer.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";
import { addProduct } from "../../controllers/product/product.controller.js";

const router = Router();

router
  .route("/addProduct")
  .post(upload.array("images", 4), verifyAdmin, verifyJWT, addProduct);
export default router;
