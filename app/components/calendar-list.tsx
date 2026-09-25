"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CalendarRace } from "../data/f1-data";

type CalendarListProps = {
  races: CalendarRace[];
};

const statusLabels: Record<"all" | CalendarRace["status"], string> = {
  all: "Todas",
  completed: "Concluidas",
  next: "Proxima",
  upcoming: "Futuras",
};

export function CalendarList({ races }: CalendarListProps) {
  const [status, setStatus] = useState<"all" | CalendarRace["status"]>("all");
  const [query, setQuery] = useState("");

  const filteredRaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return races.filter((race) => {
      const matchesStatus = status === "all" || race.status === status;
      const matchesQuery =
        race.name.toLowerCase().includes(normalizedQuery) ||
        race.circuit.toLowerCase().includes(normalizedQuery) ||
        race.country.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });
  }, [query, races, status]);

  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
            Temporada
          </p>
          <h2 className="mt-2 text-3xl font-black">Calendario completo</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/55">
          Consulte etapas por pais, circuito ou status.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <label className="grid gap-2 text-sm font-bold text-black/58">
          Buscar
          <input
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="GP, circuito ou pais"
            type="search"
            value={query}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-black/58">
          Status
          <select
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) =>
              setStatus(event.target.value as "all" | CalendarRace["status"])
            }
            value={status}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded bg-[#f5f2ec] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
            Exibindo
          </p>
          <p className="mt-2 text-2xl font-black">{filteredRaces.length}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {filteredRaces.map((race) => (
          <article className="rounded bg-[#f5f2ec] p-4" key={`${race.round}-${race.name}`}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-black text-black/45">
                R{race.round}
              </span>
              <StatusBadge status={race.status} />
            </div>
            <h3 className="mt-3 text-xl font-black">{race.name}</h3>
            <p className="mt-1 text-sm font-bold text-black/52">
              {race.circuit}
            </p>
            <p className="mt-1 text-sm font-bold text-black/42">
              {race.country} / {race.date}
            </p>
            {race.sessions && race.sessions.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {race.sessions.slice(0, 4).map((session) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded bg-white px-3 py-2 text-xs font-bold"
                    key={`${race.round}-${session.label}`}
                  >
                    <span className="text-black/58">{session.label}</span>
                    <span className="text-right text-black/42">
                      {session.date}
                      {session.time ? ` / ${session.time}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            {race.slug ? (
              <Link
                className="mt-4 inline-flex rounded bg-[#151515] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#e10600]"
                href={`/corridas/${race.slug}`}
              >
                Ver corrida
              </Link>
            ) : null}
          </article>
        ))}
      </div>

      {filteredRaces.length === 0 ? (
        <div className="mt-6 rounded bg-[#f5f2ec] p-6 text-center text-sm font-bold text-black/58">
          Nenhuma etapa encontrada com esses filtros.
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: CalendarRace["status"] }) {
  const label = statusLabels[status];
  const className =
    status === "completed"
      ? "bg-white text-black/58"
      : status === "next"
        ? "bg-[#e10600] text-white"
        : "bg-[#151515] text-white";

  return (
    <span className={`rounded px-2 py-1 text-xs font-black ${className}`}>
      {label}
    </span>
  );
}
