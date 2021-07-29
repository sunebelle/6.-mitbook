import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
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

const PostMessage = mongoose.model("PostMessage", postSchema);

export default PostMessage;
