import { Router } from "express";
import {
  getAllUsers,
  getMostActiveUsers,
  getUserDetails,
  getUserFirstName,
  loginUser,
  logoutUser,
  registerUser,
  removeUser,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { verifyAdmin } from "../../middleware/isAdmin.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get-user-first-name").get(verifyJWT, getUserFirstName);
router.route("/get-user-details").get(verifyAdmin, verifyJWT, getUserDetails);
router.route("/get-all-users").get(verifyAdmin, verifyJWT, getAllUsers);
router
  .route("/most-active-users")
  .get(verifyAdmin, verifyJWT, getMostActiveUsers);
router.route("/remove-user/:userId").delete(verifyAdmin, verifyJWT, removeUser);
export default router;
