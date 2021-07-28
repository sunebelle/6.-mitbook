import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  creatorId: String,
  name: String,
  photoURL: String,
  tags: [String],
  file: String,
  // file: { data: Buffer, contentType: String },
  likes: { type: [String], default: [] },
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});
// const postSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, "Title is required"],
//   },
//   message: String,
//   creator: String,
//   tags: [String],
//   file: String,
//   // file: { data: Buffer, contentType: String },
//   likeCount: {
//     type: Number,
//     default: 0,
//   },
//   createdAt: {
//     type: Date,
//     default: new Date(),
//   },
// });

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
