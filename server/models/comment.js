import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Comment can't be empty"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    name: String,
    // user: {
    //   type: String,
    //   ref: "User",
    //   required: [true, "Comment must belongs to a user"],
    // },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "PostMessage",
      required: [true, "Comment must be about a post"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// you only can create a comment for a post
// commentSchema.index({ post: 1 }, { unique: true });

// commentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: user,
//     select: "name  photoURL",
//   });
//   next();
// });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
