import { NextRequest, NextResponse } from "next/server";
import { upsertConfig, getConfigByName } from "../../lib/db";
import { ClinicConfig } from "../../lib/types";

// POST /api/config — save (upsert) a clinic config
export async function POST(req: NextRequest) {
  try {
    const config: ClinicConfig = await req.json();

    if (!config?.clinicName) {
      return NextResponse.json({ ok: false, error: "clinicName is required" }, { status: 400 });
    }

    const id = await upsertConfig(config);
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("POST /api/config error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// GET /api/config?name=Northside+Family+Clinic — load by clinic name
export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    if (!name) {
      return NextResponse.json({ ok: false, error: "name param required" }, { status: 400 });
    }

    const config = await getConfigByName(name);
    if (!config) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, config });
  } catch (err) {
    console.error("GET /api/config error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
