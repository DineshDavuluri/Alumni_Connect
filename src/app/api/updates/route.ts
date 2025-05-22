import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import UpdateModel from "../../../models/Update";

export async function GET() {
  try {
    await connectDB();
    const updates = await UpdateModel.find().limit(3).sort({ createdAt: -1 });
    return NextResponse.json(updates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch updates "+error }, { status: 500 });
  }
}