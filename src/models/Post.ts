import { Schema, Document, models, model } from "mongoose";

export interface IPost extends Document {
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Avoid model overwrite issues in dev environments with hot reloading
const Post = models.Post || model<IPost>("Post", PostSchema);

export default Post;
