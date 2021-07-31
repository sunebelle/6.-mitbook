import Comment from "../models/comment.js";

export const setCommentUserId = async (req, res, next) => {
  // console.log(req.userId);
  if (!req.body.post) req.body.post = req.params.id; //PostId from URL
  // if (!req.body.user) req.body.user = req.userId; //UserId from auth middleware, token
  next();
};

export const getComments = async (req, res) => {
  // console.log(req.params);
  try {
    const comments = await Comment.find({ post: req.params.id }).sort(
      "createdAt"
    );
    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).json(comment);
  } catch (error) {
    console.log(error.message);
    res.status(409).json({ message: error.message });
  }
};
