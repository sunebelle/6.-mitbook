import express from "express";

import {
  getPosts,
  getPost,
  getPostsBySearch,
  createPost,
  updatePost,
  likePost,
  deletePost,
  uploadUserPhoto,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";
import commentRouter from "./comment.js";

const router = express.Router();

router.use("/:id/comment", commentRouter);
router.route("/").get(getPosts).post(auth, uploadUserPhoto, createPost);
//  `/posts/search?searchQuery=${searchText: "the alchemist"}&tags=${searchTag: "book,story,startup"}`

router.route("/search").get(getPostsBySearch);

// router.use(auth);
router.patch("/:id/likePost", auth, likePost);
router
  .route("/:id")
  .get(getPost)
  .patch(auth, uploadUserPhoto, updatePost)
  .delete(auth, deletePost);

export default router;
