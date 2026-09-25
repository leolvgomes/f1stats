import type { NextRequest } from "next/server";
import { getCalendarData } from "../../../lib/f1-api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season") ?? "current";
  const calendar = await getCalendarData(season);

  return Response.json({
    races: calendar.races,
    season: calendar.season,
    source: calendar.source,
    sourceLabel: calendar.sourceLabel,
  });
}
