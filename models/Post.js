import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "To learn",
    enum: ["To learn", "Learning", "Learned"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", //schema Users :D
  },
});

export default mongoose.model("Posts", PostSchema);
