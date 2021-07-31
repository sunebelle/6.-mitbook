import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Please give a valid email"],
    // unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  password: {
    type: String,
    required: [true, "Please create a password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // this only works on save and create
      validator: function (el) {
        return this.password === el;
      },
      message: "password does not match",
    },
  },
  imageUrl: String,
  // id: { type: String },
});

userSchema.pre("save", async function (next) {
  const seed = Math.floor(Math.random() * 5000);
  this.imageUrl = `https://avatars.dicebear.com/api/human/${seed}.svg`;

  // hash password 12 salts
  this.password = await bcrypt.hash(this.password, 12);

  // delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});
const User = mongoose.model("User", userSchema);
export default User;
