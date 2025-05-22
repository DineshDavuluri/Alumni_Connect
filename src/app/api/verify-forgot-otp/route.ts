import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import mongoose from "mongoose";

const PendingResetSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, default: () => Date.now() + 10 * 60 * 1000, expires: 600 },
});

if (mongoose.models.PendingReset) delete mongoose.models.PendingReset;
const PendingReset = mongoose.model("PendingReset", PendingResetSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    const pendingReset = await PendingReset.findOne({ email, otp }).exec();
    if (!pendingReset) {
      return NextResponse.json({ error: "Invalid OTP or email" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "OTP verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify Forgot OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}