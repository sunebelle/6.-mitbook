import express from "express";
import cors from "cors";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/user.js";
const app = express();

// Serving static files
app.use("/public", express.static("public"));
// app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use((req, res, next) => {
//   console.log("Middleware is checking here!");
//   next();
// });

app.use("/posts", postRoutes);
app.use("/user", userRoutes);

// ERROR handling middleware
// app.use(errorGlobalHandler);
export default app;
