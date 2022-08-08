import express from "express";
import postController from "../controllers/postController.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

//get all posts of user
router.get("/", verifyToken, postController.getAllPosts);

//create posts
router.post("/", verifyToken, postController.creteaPost);

//update post
router.put("/:id", verifyToken, postController.updatePost);

//delete
router.delete("/:id", verifyToken, postController.deletePost);
export default router;
