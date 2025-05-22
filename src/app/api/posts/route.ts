import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import Post from "../../../models/Post";

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  await connectDB();
  const { author, content } = await req.json();
  const newPost = new Post({ author, content });
  await newPost.save();
  return NextResponse.json(newPost, { status: 201 });
}
