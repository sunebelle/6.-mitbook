import express from "express";
import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
import catchAsync from "../utils/catchAsync.js";
import multer from "multer";

const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
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

// const upload = multer({ dest: "pubic/img" });

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}-${file.originalname}`);
  },
});
// const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images"));
  }
};

const upload = multer({ storage: multerStorage });
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadUserPhoto = upload.single("file");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  //The memory storage engine stores the files in memory as Buffer objects. It doesn't have any options.
  await sharp(req.file.buffer)
    .resize(500, 500)
    // .toFormat("jpeg")
    // .jpeg({ quality: 100 })
    .toFile(`pubic/img/${req.file.filename}`);

  next();
});

//https://stackoverflow.com/questions/68458120/display-image-in-reactjs-from-express-backend
export const createPost = async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  let file;
  const { title, message, creator, tags } = req.body;
  if (req.file) file = req.file.path;

  // let file = { data: "", contentType: "" };
  // if (req.file) {
  //   file.data = fs.readFileSync(req.file.path);
  //   file.contentType = "image/jpeg";
  // }

  // if (req.file) {
  //   if (!req.file.mimetype.startsWith("image")) {
  //     return new Error("Not an image! Please upload only images");
  //   }
  //   req.file.filename = `${Date.now()}.jpeg`;
  //   // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  //   file = req.file.filename;
  // }

  const newPostMessage = new PostMessage({
    title,
    message,
    file,
    creator,
    tags,
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    let file;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);

    const { title, message, creator, tags } = req.body;

    console.log(req.file);
    if (req.file) {
      if (!req.file.mimetype.startsWith("image")) {
        return new Error("Not an image! Please upload only images");
      }
      req.file.filename = `${Date.now()}.jpeg`;
      // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
      // file = req.file.filename;
    }

    const updatedPost = {
      creator,
      title,
      message,
      tags,
      file,
      _id: id,
    };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
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

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};

export default router;
