import { Router } from "express";
import { createCart, getCart } from "../../controllers/cart/cart.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/create-cart/user/:userId/product/:productId").post(verifyJWT,createCart);
router.route("/get-cart/user/:userId").get(verifyJWT,getCart);

export default router;
