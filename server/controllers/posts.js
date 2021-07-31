import express from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import multer from "multer";

const router = express.Router();

export const getPosts = async (req, res) => {
  // console.log(req.query);
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit; //startIndex

  try {
    const totalOfPages = await PostMessage.countDocuments();
    const posts = await PostMessage.find()
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      numberOfPages: Math.ceil(totalOfPages / limit),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostMessage.find({
      $and: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}-${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("file");

export const createPost = async (req, res) => {
  try {
    let file;
    const { title, message, name, tags, photoURL } = req.body;
    const getTags = tags.split(",");
    const creatorId = req.userId;
    if (req.file) file = req.file.path;

    const newPostMessage = new PostMessage({
      title,
      creatorId,
      photoURL,
      message,
      file,
      name,
      tags: getTags,
    });

    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    console.log(error);
    // console.log(error.message);
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    let file;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    const { title, message, tags } = req.body;
    const getTags = tags.split(",");
    if (req.file) file = req.file.path;

    const updatedPost = {
      title,
      message,
      tags: getTags,
      file,
      // _id: id,
    };

    // await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    // const foundUpdatedPost = await PostMessage.findOneAndUpdate(
    //   { _id: id },
    //   {$set: req.body},
    //   { new: true },
    //   (err, foundPost) => {
    //     if (err) throw new Error("There is no post updated");
    //     return foundPost;
    //   }
    // );
    // res.json(foundUpdatedPost);

    await PostMessage.findOneAndUpdate(
      { _id: id },
      updatedPost,
      { new: true },
      (err, foundPost) => {
        if (foundPost) {
          res.json(foundPost);
        } else {
          res.send("There is no post updated");
        }
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  // liking a post is actually equivalent to update a post with its new updated likes property
  const likedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(likedPost);
};

export default router;
