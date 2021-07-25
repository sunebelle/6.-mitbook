import express from "express";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

export default app;
