import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const startedAt = new Date().toISOString();

  try {
    // TODO:
    // 1. fetch latest insider / politician / Form 4 data
    // 2. normalize records
    // 3. upsert into database
    // 4. optionally trigger revalidation

    return NextResponse.json({
      ok: true,
      message: "Cron sync endpoint is live",
      startedAt,
      source: "vercel-cron",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown sync error",
        startedAt,
      },
      { status: 500 }
    );
  }
}
