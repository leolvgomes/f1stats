import type { NextRequest } from "next/server";
import { getConstructorStandings, getDriverStandings } from "../../../lib/f1-api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season") ?? "current";

  try {
    const [drivers, constructors] = await Promise.all([
      getDriverStandings(season),
      getConstructorStandings(season),
    ]);

    return Response.json({
      constructors,
      drivers,
      season,
      source: "Jolpica F1 API",
    });
  } catch {
    return Response.json(
      {
        constructors: [],
        drivers: [],
        error: "Nao foi possivel buscar standings externos agora.",
        season,
      },
      {
        status: 502,
      },
    );
  }
}
