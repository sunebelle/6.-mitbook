import mongoose from "mongoose";
import app from "./index.js";
import dotevn from "dotenv";
dotevn.config();

mongoose.connect(
  // "mongodb://localhost:27017/mern_memoriesDB",
  process.env.ATLAS_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("connect to DB successfully")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
