import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = 5;
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event count "+error }, { status: 500 });
  }
}