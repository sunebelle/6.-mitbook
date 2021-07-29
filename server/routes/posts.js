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

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(auth, uploadUserPhoto, createPost);
//  `/posts/search?searchQuery=${searchText: "the alchemist"}&tags=${searchTag: "book,story,startup"}`

router.route("/search").get(getPostsBySearch);

router.use(auth);
router.patch("/:id/likePost", likePost);
router
  .route("/:id")
  .get(getPost)
  .patch(uploadUserPhoto, updatePost)
  .delete(deletePost);

export default router;
