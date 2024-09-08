import { Router } from "express";
import {
  getUserDetails,
  getUserFirstName,
  loginUser,
  logoutUser,
  registerUser,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get-user-first-name").get(verifyJWT, getUserFirstName);
router.route("/get-user-details").get(verifyJWT, getUserDetails);
export default router;
