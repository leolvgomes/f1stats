import type { NextRequest } from "next/server";
import { getSearchData } from "../../../lib/f1-api";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const season = request.nextUrl.searchParams.get("season") ?? "current";
  const search = await getSearchData(season);

  return Response.json(search);
}
