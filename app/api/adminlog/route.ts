import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import AdminLog from "@/models/AdminLog";

export const runtime = "nodejs";

export async function GET() {
  try {
    await dbConnect();

    const logs = await AdminLog.find({})
      .sort({ timestamp: -1 })
      .populate("userId", "firstName lastName"); 

    return NextResponse.json(logs);
  } catch (err) {
    console.error("Failed to fetch admin logs:", err);
    return NextResponse.json(
      { error: "Failed to fetch admin logs" },
      { status: 500 }
    );
  }
}