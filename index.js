import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import postRoute from "./routes/post.js";

dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan("dev"));

//connect db
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connect mongoodb success");
});

//routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
