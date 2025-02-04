import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  deleteUser,
  getUserData,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/register", deleteUser);
router.get("/userdata", verifyToken, getUserData);

export default router;
