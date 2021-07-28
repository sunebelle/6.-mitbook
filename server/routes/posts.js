import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  likePost,
  deletePost,
  uploadUserPhoto,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getPosts).post(auth, uploadUserPhoto, createPost);

router.use(auth);
router.patch("/:id/likePost", likePost);
router.route("/:id").patch(uploadUserPhoto, updatePost).delete(deletePost);

// router.get("/", getPosts);
// router.post("/", uploadUserPhoto, createPost);
// router.patch("/:id", uploadUserPhoto, updatePost);
// router.delete("/:id", deletePost);
// router.post("/", auth, createPost);
// router.patch("/:id", auth, updatePost);
// router.delete("/:id", auth, deletePost);

export default router;
