import { NextResponse } from "next/server";
import { getHomeData } from "../../../lib/home-data";

export async function GET() {
  try {
    const data = await getHomeData();

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/home failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to load home data",
      },
      { status: 500 }
    );
  }
}
