import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import User from "@/src/models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const usernameSchema = z.string().regex(/^\d{2}FE\d[a-zA-Z]\d{4}$/, {
  message: "Username must be 10 characters: 2 numbers, 'FE', 1 number, 1 letter, 4 numbers",
});
const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
  message: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
});
const emailSchema = z.string().email({ message: "Invalid email address" });

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password, confirmPassword } = await req.json();

    usernameSchema.parse(username);
    emailSchema.parse(email);
    passwordSchema.parse(password);
    await User.deleteMany({isVerified:false});
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const existingUser = await User.findOne({ username }).exec();
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      otp,
      isVerified: false 
    });

    console.log("User Schema Fields:", Object.keys(User.schema.paths));
    const savedUser = await user.save();
    console.log("Saved User (raw):", savedUser.toObject());

    if (!savedUser.otp) {
      console.error("OTP not saved in document!");
      throw new Error("Failed to save OTP");
    }

    await sendVerificationEmail(email, username, otp);

    return NextResponse.json({ 
      message: "User created successfully. Verification email sent.",
      username 
    }, { status: 201 });
  } catch (error) {
    let errorMessage = "Internal server error";
    if (error instanceof z.ZodError) {
      errorMessage = error.errors[0]?.message || "Invalid input";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Signup Error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function sendVerificationEmail(email: string, username: string, otp: string) {
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
    subject: "LARA CONNECT - Email Verification",
    text: `Hello ${username},\n\nWelcome to LARA CONNECT! Your account has been successfully created.\n\nPlease use this OTP to verify your email: ${otp}\n\nThis OTP is valid for 10 minutes.\n\nBest Regards,\nLARA CONNECT Team`,
  };

  await transporter.sendMail(mailOptions);
}