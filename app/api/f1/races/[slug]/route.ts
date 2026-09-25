import type { NextRequest } from "next/server";
import { getRaceDetails } from "../../../../lib/f1-api";

type RaceRouteProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function GET(request: NextRequest, { params }: RaceRouteProps) {
  const { slug } = await params;
  const season = request.nextUrl.searchParams.get("season") ?? "current";
  const details = await getRaceDetails(slug, season);

  if (!details) {
    return Response.json({ error: "Race not found" }, { status: 404 });
  }

  return Response.json(details);
}
