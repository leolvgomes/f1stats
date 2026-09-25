"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RaceResult, SessionType } from "../data/f1-data";

type RaceResultsProps = {
  results: RaceResult[];
};

const sessionLabels: Record<"all" | SessionType, string> = {
  all: "Todas",
  qualifying: "Classificacao",
  race: "Corrida",
  sprint: "Sprint",
};

export function RaceResults({ results }: RaceResultsProps) {
  const [teamFilter, setTeamFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState<"all" | SessionType>("all");

  const teams = useMemo(() => {
    return Array.from(
      new Set(
        results.flatMap((result) =>
          result.sessions.map((session) => session.team),
        ),
      ),
    ).sort();
  }, [results]);

  const filteredResults = useMemo(() => {
    return results
      .map((result) => {
        const sessions = result.sessions.filter((session) => {
          const matchesTeam = teamFilter === "all" || session.team === teamFilter;
          const matchesSession =
            sessionFilter === "all" || session.type === sessionFilter;

          return matchesTeam && matchesSession;
        });

        return {
          ...result,
          sessions,
        };
      })
      .filter((result) => result.sessions.length > 0);
  }, [results, sessionFilter, teamFilter]);

  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
            Resultados
          </p>
          <h2 className="mt-2 text-3xl font-black">Ultimas corridas</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/55">
          Historico demo com filtros por equipe e tipo de sessao.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <div className="rounded bg-[#f5f2ec] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
            Exibindo
          </p>
          <p className="mt-2 text-2xl font-black">
            {filteredResults.length} corridas
          </p>
        </div>

        <label className="grid gap-2 text-sm font-bold text-black/58">
          Equipe
          <select
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) => setTeamFilter(event.target.value)}
            value={teamFilter}
          >
            <option value="all">Todas</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-bold text-black/58">
          Sessao
          <select
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) =>
              setSessionFilter(event.target.value as "all" | SessionType)
            }
            value={sessionFilter}
          >
            {Object.entries(sessionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {filteredResults.map((result) => (
          <article className="rounded bg-[#f5f2ec] p-4" key={result.race}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-black text-black/45">
                R{result.round}
              </span>
              <span className="rounded bg-white px-2 py-1 text-xs font-black">
                {result.date}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-black">{result.race}</h3>
            <p className="mt-1 text-sm font-bold text-black/52">
              {result.circuit} / {result.country}
            </p>
            <div className="mt-4 grid gap-2">
              {result.sessions.map((session) => (
                <div className="rounded bg-white p-3" key={session.label}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-black/42">
                      {session.label}
                    </span>
                    <span className="text-sm font-black">{session.team}</span>
                  </div>
                  <p className="mt-2 font-black">{session.winner}</p>
                  <p className="mt-1 text-sm font-bold text-black/52">
                    {session.note}
                  </p>
                </div>
              ))}
            </div>
            <Link
              className="mt-4 inline-flex rounded bg-[#151515] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#e10600]"
              href={`/corridas/${result.slug}`}
            >
              Ver corrida
            </Link>
          </article>
        ))}
      </div>

      {filteredResults.length === 0 ? (
        <div className="mt-6 rounded bg-[#f5f2ec] p-6 text-center text-sm font-bold text-black/58">
          Nenhuma corrida encontrada com esses filtros.
        </div>
      ) : null}
    </div>
  );
}
