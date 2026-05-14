import { NextRequest, NextResponse } from "next/server";
import { analyzeSite } from "@/lib/audit/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'url' in request body" }, { status: 400 });
    }

    const result = await analyzeSite(url);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err: any) {
    console.error("Audit analysis error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
