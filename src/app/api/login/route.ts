import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongoose";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const usernameSchema = z.string().regex(/^\d{2}FE\d[a-zA-Z]\d{4}$/);
const passwordSchema = z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/);

export async function POST(req: Request) {
  try {
    await connectDB();
    await User.deleteMany({isVerified:false});
    const { username, password } = await req.json();
    usernameSchema.parse(username);
    passwordSchema.parse(password);

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect Password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    return NextResponse.json({ error: "Login Route error: " + error }, { status: 500 });
  }
}
