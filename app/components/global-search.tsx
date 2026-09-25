"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "../lib/search-types";

type GlobalSearchProps = {
  items: SearchItem[];
};

const typeLabels: Record<"all" | SearchItem["type"], string> = {
  all: "Tudo",
  calendar: "Calendario",
  driver: "Pilotos",
  race: "Corridas",
  team: "Equipes",
};

export function GlobalSearch({ items }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | SearchItem["type"]>("all");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesType = type === "all" || item.type === type;
      const matchesQuery =
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.meta.toLowerCase().includes(normalizedQuery);

      return matchesType && matchesQuery;
    });
  }, [items, query, type]);

  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
            Busca
          </p>
          <h2 className="mt-2 text-3xl font-black">Encontrar no F1 Stats</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/55">
          Busque por piloto, equipe, corrida, circuito ou pais.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px_180px]">
        <label className="grid gap-2 text-sm font-bold text-black/58">
          Buscar
          <input
            autoFocus
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex: Norris, McLaren, Monza..."
            type="search"
            value={query}
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-black/58">
          Tipo
          <select
            className="h-11 rounded border border-black/15 bg-white px-3 text-base font-semibold text-black outline-none transition focus:border-[#e10600]"
            onChange={(event) =>
              setType(event.target.value as "all" | SearchItem["type"])
            }
            value={type}
          >
            {Object.entries(typeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded bg-[#f5f2ec] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
            Resultados
          </p>
          <p className="mt-2 text-2xl font-black">{filteredItems.length}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {filteredItems.map((item) => (
          <Link
            className="rounded bg-[#f5f2ec] p-4 transition hover:bg-[#eee5d6]"
            href={item.href}
            key={`${item.type}-${item.href}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xl font-black">{item.title}</p>
                <p className="mt-1 text-sm font-bold leading-6 text-black/58">
                  {item.description}
                </p>
              </div>
              <span className="rounded bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-black/52">
                {typeLabels[item.type]}
              </span>
            </div>
            <p className="mt-3 text-sm font-bold text-black/42">{item.meta}</p>
          </Link>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-6 rounded bg-[#f5f2ec] p-6 text-center text-sm font-bold text-black/58">
          Nenhum resultado encontrado.
        </div>
      ) : null}
    </div>
  );
}
