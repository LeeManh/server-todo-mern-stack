import Posts from "../models/Post.js";

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const posts = await Posts.find({ user: req.user.userId }).populate(
        "user",
        ["username"]
      );

      return res.status(200).json({ success: true, posts });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  creteaPost: async (req, res) => {
    const { title, description, url, status } = req.body;

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required!" });

    try {
      const newPost = new Posts({
        title,
        description,
        url: url.startsWith("https://") ? url : `https://${url}`,
        status: status || "To learn",
        user: req.user.userId,
      });

      await newPost.save();

      return res.json({
        success: true,
        message: "Create post success",
        post: newPost,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  updatePost: async (req, res) => {
    const { title, description, url, status } = req.body;

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "Title is required!" });

    try {
      const postUpdateCondition = { _id: req.params.id, user: req.user.userId };

      const updatedPost = await Posts.findOneAndUpdate(
        postUpdateCondition,
        {
          title,
          description: description || "",
          url: url ? (url.startsWith("https://") ? url : `https://${url}`) : "",
          status: status || "To learn",
        },
        { new: true }
      );

      // User not authorised to update post or post not found
      if (!updatedPost)
        return res.status(401).json({
          success: false,
          message: "Post not found or user not authorised",
        });

      return res.json({
        success: true,
        message: "Update post success",
        post: updatedPost,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const postDeleteCondition = { _id: req.params.id, user: req.user.userId };

      const postDelete = await Posts.findOneAndDelete(postDeleteCondition);

      if (!postDelete)
        return res.status(401).json({
          success: false,
          message: "Post not found or user not authorised",
        });

      return res.json({
        success: true,
        message: "Delete post success",
      });
    } catch (error) {}
  },
};

export default postController;
