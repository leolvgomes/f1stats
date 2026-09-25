"use client";

import { useEffect, useMemo, useState } from "react";
import type { PointsProgression, SeasonOption } from "../data/f1-data";

type SeasonInsightsProps = {
  progressionsBySeason: Record<string, PointsProgression[]>;
  seasons: SeasonOption[];
};

export function SeasonInsights({
  progressionsBySeason,
  seasons,
}: SeasonInsightsProps) {
  const [selectedYear, setSelectedYear] = useState(() => {
    if (typeof window === "undefined") {
      return seasons[0]?.year ?? "";
    }

    return window.localStorage.getItem("f1stats:season") ?? seasons[0]?.year ?? "";
  });

  useEffect(() => {
    window.localStorage.setItem("f1stats:season", selectedYear);
  }, [selectedYear]);

  const selectedSeason =
    seasons.find((season) => season.year === selectedYear) ?? seasons[0];
  const progressions =
    progressionsBySeason[selectedSeason?.year ?? ""] ?? progressionsBySeason["2026"];

  const leaderGap = selectedSeason
    ? selectedSeason.leaderPoints - selectedSeason.runnerUpPoints
    : 0;

  return (
    <section
      className="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-8 lg:px-10"
      id="temporada"
    >
      <div className="f1-card rounded p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="f1-eyebrow">
              Analise
            </p>
            <h2 className="f1-section-heading mt-2 text-3xl">Evolucao da temporada</h2>
          </div>

          <label className="grid gap-2 text-sm font-bold text-black/58">
            Temporada
            <select
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600] focus:ring-4 focus:ring-[#e10600]/10"
              onChange={(event) => setSelectedYear(event.target.value)}
              value={selectedSeason?.year}
            >
              {seasons.map((season) => (
                <option key={season.year} value={season.year}>
                  {season.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedSeason ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <InsightCard
                detail={`${selectedSeason.runnerUp} em P2`}
                label="Lider"
                value={selectedSeason.leader}
              />
              <InsightCard
                detail={`${selectedSeason.racesDone}/${selectedSeason.racesTotal} corridas`}
                label="Gap para P2"
                value={`${leaderGap} pts`}
              />
              <InsightCard
                detail="pilotos diferentes"
                label="Vencedores"
                value={selectedSeason.winners.toString()}
              />
            </div>

            <PointsChart progressions={progressions} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function InsightCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="f1-card-soft rounded p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm font-bold text-black/52">{detail}</p>
    </div>
  );
}

function PointsChart({ progressions }: { progressions: PointsProgression[] }) {
  const chart = useMemo(() => {
    const width = 760;
    const height = 300;
    const padding = 28;
    const maxPoints = Math.max(
      ...progressions.flatMap((progression) => progression.points),
    );
    const maxRounds = Math.max(
      ...progressions.map((progression) => progression.points.length),
    );

    return {
      height,
      maxPoints,
      paths: progressions.map((progression) => {
        const points = progression.points
          .map((point, index) => {
            const x =
              padding +
              (index / Math.max(1, maxRounds - 1)) * (width - padding * 2);
            const y =
              height -
              padding -
              (point / maxPoints) * (height - padding * 2);

            return `${x.toFixed(1)},${y.toFixed(1)}`;
          })
          .join(" ");

        return {
          ...progression,
          points,
        };
      }),
      width,
    };
  }, [progressions]);

  return (
    <div className="f1-dark-card rounded p-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
            Pontos acumulados
          </p>
          <h3 className="mt-2 text-2xl font-black">Top drivers</h3>
        </div>
        <p className="text-sm font-bold text-white/52">
          Max: {chart.maxPoints} pts
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded bg-white/[0.04] ring-1 ring-white/10">
        <svg
          aria-label="Grafico de evolucao de pontos por corrida"
          className="h-auto w-full"
          role="img"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
        >
          <line
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            x1="28"
            x2="732"
            y1="272"
            y2="272"
          />
          <line
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="1"
            x1="28"
            x2="28"
            y1="28"
            y2="272"
          />
          {chart.paths.map((path) => (
            <polyline
              fill="none"
              key={path.driver}
              points={path.points}
              stroke={path.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          ))}
        </svg>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {progressions.map((progression) => (
          <div className="flex items-center gap-2" key={progression.driver}>
            <span
              className="size-3 rounded"
              style={{ backgroundColor: progression.color }}
            />
            <span className="text-sm font-bold text-white/72">
              {progression.driver}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
