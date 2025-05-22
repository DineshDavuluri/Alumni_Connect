import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import mongoose from "mongoose";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailSchema = z.string().email({ message: "Invalid email address" });

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

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    emailSchema.parse(email);

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const existingPending = await PendingReset.findOne({ email }).exec();
    if (existingPending) {
      await PendingReset.deleteOne({ email });
    }

    const otp = generateOTP();
    const pendingReset = new PendingReset({ email, otp });
    await pendingReset.save();

    await sendResetEmail(email, user.username, otp);

    return NextResponse.json(
      { message: "OTP sent to your email for password reset." },
      { status: 200 }
    );
  } catch (error) {
    let errorMessage = "Internal server error";
    if (error instanceof z.ZodError) {
      errorMessage = error.errors[0]?.message || "Invalid input";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function sendResetEmail(email: string, username: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "LARA CONNECT - Password Reset OTP",
    text: `Hello ${username},\n\nYou requested a password reset. Use this OTP: ${otp}\n\nValid for 10 minutes.\n\nBest Regards,\nLARA CONNECT Team`,
  };

  await transporter.sendMail(mailOptions);
}