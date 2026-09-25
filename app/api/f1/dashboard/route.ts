import type { NextRequest } from "next/server";
import { getDashboardData } from "../../../lib/f1-api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season") ?? "current";
  const dashboard = await getDashboardData(season);

  return Response.json(dashboard);
}
