import { NextResponse } from "next/server";
import { createTable } from "../../lib/db";

// GET /api/setup — run once after first deploy to create the table
// In production you'd use a migration tool; for this prototype a manual
// one-time call is fine.
export async function GET() {
  try {
    await createTable();
    return NextResponse.json({ ok: true, message: "Table created (or already exists)" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
