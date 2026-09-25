"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Driver } from "../data/f1-data";
import { trendLabel } from "../data/f1-data";

type SortKey = "position" | "points" | "wins" | "podiums";

type DriverExplorerProps = {
  drivers: Driver[];
  teams: string[];
};

const sortLabels: Record<SortKey, string> = {
  position: "Posicao",
  points: "Pontos",
  wins: "Vitorias",
  podiums: "Podios",
};

export function DriverExplorer({ drivers, teams }: DriverExplorerProps) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const savedFavorites = window.localStorage.getItem("f1stats:favorites");

      return savedFavorites ? (JSON.parse(savedFavorites) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [selectedSlug, setSelectedSlug] = useState(drivers[0]?.slug ?? "");

  useEffect(() => {
    window.localStorage.setItem(
      "f1stats:favorites",
      JSON.stringify(favoriteSlugs),
    );
  }, [favoriteSlugs]);

  const filteredDrivers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return drivers
      .filter((driver) => {
        const matchesQuery =
          driver.name.toLowerCase().includes(normalizedQuery) ||
          driver.country.toLowerCase().includes(normalizedQuery) ||
          driver.team.toLowerCase().includes(normalizedQuery);
        const matchesTeam = team === "all" || driver.team === team;
        const matchesFavorites =
          !onlyFavorites || favoriteSlugs.includes(driver.slug);

        return matchesQuery && matchesTeam && matchesFavorites;
      })
      .sort((first, second) => {
        if (sortKey === "position") {
          return first.position - second.position;
        }

        return second[sortKey] - first[sortKey];
      });
  }, [drivers, favoriteSlugs, onlyFavorites, query, sortKey, team]);

  const selectedDriver =
    drivers.find((driver) => driver.slug === selectedSlug) ?? filteredDrivers[0];
  const pointsLeader = Math.max(...drivers.map((driver) => driver.points));

  function toggleFavorite(slug: string) {
    setFavoriteSlugs((currentFavorites) =>
      currentFavorites.includes(slug)
        ? currentFavorites.filter((favoriteSlug) => favoriteSlug !== slug)
        : [...currentFavorites, slug],
    );
  }

  return (
    <div className="rounded border border-black/10 bg-white" id="pilotos">
      <div className="border-b border-black/10 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Campeonato
            </p>
            <h2 className="mt-2 text-3xl font-black">Pilotos</h2>
          </div>
          <span className="rounded bg-[#f5f2ec] px-3 py-2 text-sm font-bold text-black/60">
            Dados de exemplo
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="grid gap-2 text-sm font-bold text-black/58">
            Buscar
            <input
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Piloto, equipe ou pais"
              type="search"
              value={query}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-black/58">
            Equipe
            <select
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
              onChange={(event) => setTeam(event.target.value)}
              value={team}
            >
              <option value="all">Todas</option>
              {teams.map((teamName) => (
                <option key={teamName} value={teamName}>
                  {teamName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-black/58">
            Ordenar
            <select
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              value={sortKey}
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm font-bold text-black/62">
            <input
              checked={onlyFavorites}
              className="size-4 accent-[#e10600]"
              onChange={(event) => setOnlyFavorites(event.target.checked)}
              type="checkbox"
            />
            Mostrar apenas favoritos
          </label>
          <p className="text-sm font-bold text-black/45">
            {filteredDrivers.length} de {drivers.length} pilotos
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-[#f7f7f7] text-xs uppercase tracking-[0.14em] text-black/45">
              <tr>
                <th className="px-5 py-4">Pos</th>
                <th className="px-5 py-4">Piloto</th>
                <th className="px-5 py-4">Equipe</th>
                <th className="px-5 py-4">Pts</th>
                <th className="px-5 py-4">Vitorias</th>
                <th className="px-5 py-4">Forma</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr className="border-t border-black/8 transition hover:bg-[#fff8ed]" key={driver.slug}>
                  <td className="px-5 py-4 text-xl font-black">
                    {driver.position}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        aria-label={
                          favoriteSlugs.includes(driver.slug)
                            ? `Remover ${driver.name} dos favoritos`
                            : `Favoritar ${driver.name}`
                        }
                        className="grid size-8 place-items-center rounded border border-black/10 text-sm font-black transition hover:border-[#e10600]"
                        onClick={() => toggleFavorite(driver.slug)}
                        type="button"
                      >
                        {favoriteSlugs.includes(driver.slug) ? "OK" : "+"}
                      </button>
                      <button
                        className="text-left"
                        onClick={() => setSelectedSlug(driver.slug)}
                        type="button"
                      >
                        <span className="block font-black">{driver.name}</span>
                        <span className="block text-sm text-black/48">
                          {driver.country} / #{driver.number}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-black/65">{driver.team}</td>
                  <td className="px-5 py-4 font-black">{driver.points}</td>
                  <td className="px-5 py-4">{driver.wins}</td>
                  <td className="px-5 py-4">
                    <span className="rounded bg-[#f5f2ec] px-3 py-1 text-sm font-bold">
                      {trendLabel[driver.trend]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDrivers.length === 0 ? (
            <div className="border-t border-black/10 p-8 text-center text-sm font-bold text-black/55">
              Nenhum piloto encontrado com esses filtros.
            </div>
          ) : null}
        </div>

        {selectedDriver ? (
          <aside className="border-t border-black/10 bg-[#151515] p-5 text-white lg:border-l lg:border-t-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
              Piloto selecionado
            </p>
            <h3 className="mt-2 text-3xl font-black">{selectedDriver.name}</h3>
            <p className="mt-1 text-sm font-semibold text-white/58">
              {selectedDriver.team} / {selectedDriver.country} / #{selectedDriver.number}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/62">
              {selectedDriver.summary}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatTile label="Pontos" value={selectedDriver.points} />
              <StatTile label="Vitorias" value={selectedDriver.wins} />
              <StatTile label="Podios" value={selectedDriver.podiums} />
              <StatTile label="Voltas rapidas" value={selectedDriver.fastestLaps} />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm font-bold text-white/62">
                <span>Ritmo do campeonato</span>
                <span>{selectedDriver.points} pts</span>
              </div>
              <div className="h-4 overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded bg-[#e10600]"
                  style={{
                    width: `${(selectedDriver.points / pointsLeader) * 100}%`,
                  }}
                />
              </div>
            </div>

            <Link
              className="mt-6 inline-flex rounded bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#151515] transition hover:bg-[#ffcc00]"
              href={`/pilotos/${selectedDriver.slug}`}
            >
              Ver detalhes
            </Link>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
