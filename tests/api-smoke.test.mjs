import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.F1_STATS_BASE_URL ?? "http://localhost:3000";

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);

  assert.equal(
    response.ok,
    true,
    `${path} respondeu ${response.status}. Rode npm run dev antes dos testes.`,
  );

  return response.json();
}

test("dashboard API exposes standings and fallback metadata", async () => {
  const dashboard = await getJson("/api/f1/dashboard");

  assert.ok(Array.isArray(dashboard.drivers));
  assert.ok(dashboard.drivers.length > 0);
  assert.ok(Array.isArray(dashboard.constructors));
  assert.match(dashboard.source, /^(api|mock)$/);
});

test("schedule API exposes races and session data when available", async () => {
  const schedule = await getJson("/api/f1/schedule");

  assert.ok(Array.isArray(schedule.races));
  assert.ok(schedule.races.length > 0);
  assert.ok(schedule.races.some((race) => race.status === "next"));
});

test("race details API exposes classifications with fallback", async () => {
  const details = await getJson("/api/f1/races/azerbaijan-gp");

  assert.equal(details.race.slug, "azerbaijan-gp");
  assert.ok(Array.isArray(details.race.sessions));
  assert.ok(Array.isArray(details.raceResults));
  assert.match(details.source, /^(api|mock)$/);
});

test("search API indexes navigable items", async () => {
  const search = await getJson("/api/f1/search");

  assert.ok(Array.isArray(search.items));
  assert.ok(search.items.some((item) => item.href === "/corridas/azerbaijan-gp"));
});
