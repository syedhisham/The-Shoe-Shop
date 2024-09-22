import { Router } from "express";
import { createCart, deleteCartItem, getCart, getTotalItemsInCart } from "../../controllers/cart/cart.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/create-cart/user/:userId/product/:productId").post(verifyJWT,createCart);
router.route("/get-cart/user/:userId").get(verifyJWT,getCart);
router.route("/delete-item/user/:userId/product/:productId").delete(verifyJWT, deleteCartItem);
router.route("/total-items/user/:userId").get(verifyJWT, getTotalItemsInCart);

export default router;
