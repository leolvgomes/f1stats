import type { NextRequest } from "next/server";
import { getRaceSchedule } from "../../../lib/f1-api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season") ?? "current";

  try {
    const races = await getRaceSchedule(season);

    return Response.json({
      races,
      season,
      source: "Jolpica F1 API",
    });
  } catch {
    return Response.json(
      {
        error: "Nao foi possivel buscar calendario externo agora.",
        races: [],
        season,
      },
      {
        status: 502,
      },
    );
  }
}
