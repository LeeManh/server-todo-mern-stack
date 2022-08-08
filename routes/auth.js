import express from "express";
import authController from "../controllers/authController.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

//register user
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

//get user
router.get("/", verifyToken, authController.getUser);

export default router;
