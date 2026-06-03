import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const entityType =
      body?.entityType === "POLITICIAN" || body?.entityType === "TICKER"
        ? body.entityType
        : null;

    const label =
      typeof body?.label === "string" ? body.label.trim() : "";

    const symbol =
      typeof body?.symbol === "string" && body.symbol.trim()
        ? body.symbol.trim().toUpperCase()
        : null;

    const subtitle =
      typeof body?.subtitle === "string" && body.subtitle.trim()
        ? body.subtitle.trim()
        : null;

    const notes =
      typeof body?.notes === "string" && body.notes.trim()
        ? body.notes.trim()
        : null;

    if (!entityType) {
      return badRequest("entityType must be POLITICIAN or TICKER");
    }

    if (!label) {
      return badRequest("label is required");
    }

    if (entityType === "TICKER" && !symbol) {
      return badRequest("symbol is required for ticker items");
    }

    const maxSortOrder = await prisma.watchlist.aggregate({
      _max: { sortOrder: true },
    });

    const item = await prisma.watchlist.create({
      data: {
        entityType,
        symbol,
        label,
        subtitle,
        notes,
        isActive: true,
        sortOrder: (maxSortOrder._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/watchlist failed", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create watchlist item" },
      { status: 500 }
    );
  }
}
