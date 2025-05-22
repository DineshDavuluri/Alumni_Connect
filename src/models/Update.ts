import mongoose from "mongoose";

const UpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Update || mongoose.model("Update", UpdateSchema);