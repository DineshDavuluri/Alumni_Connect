import mongoose from "mongoose";
import { string } from "zod";

const UpdateSchema = new mongoose.Schema({
  id: string,
  title: string,
  content: string,
  createdAt: Date,
  authorId: string,
});

export default mongoose.models.Update || mongoose.model("Post", UpdateSchema);