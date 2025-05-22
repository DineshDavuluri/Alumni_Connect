import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

if (mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.model("User", UserSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, otp } = await req.json();

    const user = await User.findOne({ username }).select('username email otp isVerified').exec();
    console.log("Fetched User (raw):", user ? user.toObject() : null);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Stored OTP:", user.otp, "Provided OTP:", otp);
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    return NextResponse.json({ 
      message: "Email verified successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}