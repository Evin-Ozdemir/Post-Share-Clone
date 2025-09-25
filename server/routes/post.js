const {
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  createPost,
  likePost,
  addComment,
  likeComment,
} = require("../controllers/post");

const express = require("express");

const router = express.Router();

router.get("/getPosts", getPosts);
router.get("/:id", getPostById);
router.post("/createPost", createPost);
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.post("/:postId/comment/:commentId/like", likeComment);
router.patch("/updatePost/:id", updatePost);
router.delete("/deletePost/:id", deletePost);

module.exports = router;
