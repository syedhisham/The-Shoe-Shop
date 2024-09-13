import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import {
  createAReview,
  getAllReviewsOnAProduct,
  getCurrentUserReview,
} from "../../controllers/review/review.controller.js";
const router = Router();

router.route("/user/:userId/product/:productId").post(verifyJWT, createAReview);
router
  .route("/user/:userId/product/:productId/review/:reviewId")
  .get(verifyJWT, getCurrentUserReview);
router
  .route("/product/:productId")
  .get(verifyJWT, getAllReviewsOnAProduct);

export default router;
