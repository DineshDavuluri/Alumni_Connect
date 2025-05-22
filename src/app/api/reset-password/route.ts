import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import mongoose from "mongoose";
import { z } from "zod";
import bcrypt from "bcryptjs";

const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
  message: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PendingResetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000, expires: 600 },
});

if (mongoose.models.User) delete mongoose.models.User;
if (mongoose.models.PendingReset) delete mongoose.models.PendingReset;

const User = mongoose.model("User", UserSchema);
const PendingReset = mongoose.model("PendingReset", PendingResetSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password, confirmPassword } = await req.json();

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    passwordSchema.parse(password);

    const pendingReset = await PendingReset.findOne({ email }).exec();
    if (!pendingReset) {
      return NextResponse.json({ error: "No pending reset request found or OTP not verified" }, { status: 400 });
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();

    await PendingReset.deleteOne({ email });

    return NextResponse.json(
      { message: "Password reset successfully. Please login." },
      { status: 200 }
    );
  } catch (error) {
    let errorMessage = "Internal server error";
    if (error instanceof z.ZodError) {
      errorMessage = error.errors[0]?.message || "Invalid input";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}