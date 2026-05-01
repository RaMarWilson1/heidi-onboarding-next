import { NextResponse } from "next/server";
import { getAllConfigs } from "../../lib/db";

// GET /api/configs — returns all clinic configs (for admin view)
export async function GET() {
  try {
    const rows = await getAllConfigs();
    return NextResponse.json({ ok: true, configs: rows });
  } catch (err) {
    console.error("GET /api/configs error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
