import express from "express";
const router = express.Router({ mergeParams: true });
import {
  createComment,
  getComments,
  setCommentUserId,
} from "../controllers/comment.js";
import auth from "../middleware/auth.js";

//posts/:postId/comment/
router.route("/").get(getComments).post(auth, setCommentUserId, createComment);

export default router;
