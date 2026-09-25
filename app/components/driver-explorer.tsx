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
    <div className="f1-card overflow-hidden rounded" id="pilotos">
      <div className="border-b border-black/10 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="f1-eyebrow">
              Campeonato
            </p>
            <h2 className="f1-section-heading mt-2 text-3xl">Pilotos</h2>
          </div>
          <span className="rounded bg-[#f7f5ef] px-3 py-2 text-sm font-bold text-black/60">
            Dados de exemplo
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <label className="grid gap-2 text-sm font-bold text-black/58">
            Buscar
            <input
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600] focus:ring-4 focus:ring-[#e10600]/10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Piloto, equipe ou pais"
              type="search"
              value={query}
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-black/58">
            Equipe
            <select
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600] focus:ring-4 focus:ring-[#e10600]/10"
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
              className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600] focus:ring-4 focus:ring-[#e10600]/10"
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

      {selectedDriver ? (
        <aside className="f1-dark-card border-b border-black/10 p-5 text-white">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
                Piloto selecionado
              </p>
              <h3 className="mt-2 break-words text-3xl font-black sm:text-4xl">
                {selectedDriver.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-white/58">
                {selectedDriver.team} / {selectedDriver.country} / #{selectedDriver.number}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62">
                {selectedDriver.summary}
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                <StatTile label="Pontos" value={selectedDriver.points} />
                <StatTile label="Vitorias" value={selectedDriver.wins} />
                <StatTile label="Podios" value={selectedDriver.podiums} />
                <StatTile label="Voltas rapidas" value={selectedDriver.fastestLaps} />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold text-white/62">
                  <span>Ritmo do campeonato</span>
                  <span>{selectedDriver.points} pts</span>
                </div>
                <div className="h-3 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full rounded bg-[#e10600]"
                    style={{
                      width: `${(selectedDriver.points / pointsLeader) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <Link
                className="inline-flex w-fit rounded bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#151515] transition hover:bg-[#ffcc00]"
                href={`/pilotos/${selectedDriver.slug}`}
              >
                Ver detalhes
              </Link>
            </div>
          </div>
        </aside>
      ) : null}

      <div>
        <div className="min-w-0">
          <div className="hidden border-b border-black/10 bg-[#f7f5ef] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black/45 md:grid md:grid-cols-[64px_minmax(220px,1fr)_minmax(150px,0.8fr)_150px] md:items-center">
            <span>Pos</span>
            <span>Piloto</span>
            <span>Equipe</span>
            <span className="text-right">Status</span>
          </div>

          <div className="divide-y divide-black/8">
            {filteredDrivers.map((driver) => {
              const isSelected = selectedDriver?.slug === driver.slug;
              const isFavorite = favoriteSlugs.includes(driver.slug);

              return (
                <article
                  className={`grid gap-3 px-4 py-4 transition sm:px-5 md:grid-cols-[64px_minmax(220px,1fr)_minmax(150px,0.8fr)_150px] md:items-center ${
                    isSelected ? "bg-[#fff8ed]" : "hover:bg-[#fafafa]"
                  }`}
                  key={driver.slug}
                >
                  <div className="flex items-center justify-between gap-3 md:block">
                    <span className="text-2xl font-black leading-none">
                      {driver.position}
                    </span>
                    <span className="rounded bg-[#f7f5ef] px-2.5 py-1 text-xs font-black uppercase tracking-[0.12em] text-black/52 md:hidden">
                      {driver.points} pts
                    </span>
                  </div>

                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      aria-label={
                        isFavorite
                          ? `Remover ${driver.name} dos favoritos`
                          : `Favoritar ${driver.name}`
                      }
                      className={`grid size-9 shrink-0 place-items-center rounded border text-sm font-black transition ${
                        isFavorite
                          ? "border-[#e10600] bg-[#e10600] text-white"
                          : "border-black/10 bg-white text-black hover:border-[#e10600]"
                      }`}
                      onClick={() => toggleFavorite(driver.slug)}
                      type="button"
                    >
                      {isFavorite ? "OK" : "+"}
                    </button>
                    <button
                      className="min-w-0 text-left"
                      onClick={() => setSelectedSlug(driver.slug)}
                      type="button"
                    >
                      <span className="block truncate text-lg font-black leading-tight">
                        {driver.name}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-black/48">
                        {driver.country} / #{driver.number}
                      </span>
                    </button>
                  </div>

                  <div className="min-w-0 text-sm font-semibold text-black/62 md:text-base">
                    <span className="md:hidden">Equipe: </span>
                    <span className="break-words">{driver.team}</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 md:justify-end">
                    <div className="hidden text-right md:block">
                      <p className="text-lg font-black">{driver.points}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-black/42">
                        pontos
                      </p>
                    </div>
                    <span className="rounded bg-[#f7f5ef] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-black/58">
                      {trendLabel[driver.trend]}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredDrivers.length === 0 ? (
            <div className="border-t border-black/10 p-8 text-center text-sm font-bold text-black/55">
              Nenhum piloto encontrado com esses filtros.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded bg-white/10 p-4 ring-1 ring-white/10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}
