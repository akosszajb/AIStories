import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  deleteUser,
  getUserData,
  getUserProfilePictures,
  newUserProfilePictureGenerator,
  updateUser,
  getUserCurrentProfilePicture,
  updateCurrentProfilePicture,
  deleteSelectedProfilePicture,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/register", deleteUser);
router.get("/userdata", verifyToken, getUserData);
router.get("/userprofilepictures", verifyToken, getUserProfilePictures);
router.post(
  "/generatenewuserprofilepicture",
  verifyToken,
  newUserProfilePictureGenerator
);
router.post("/updateuserdata", verifyToken, updateUser);
router.get(
  "/usercurrentprofilepicture",
  verifyToken,
  getUserCurrentProfilePicture
);
router.post(
  "/updatecurrentprofilepicture",
  verifyToken,
  updateCurrentProfilePicture
);
router.delete(
  "/deleteprofilepicture",
  verifyToken,
  deleteSelectedProfilePicture
);

export default router;
