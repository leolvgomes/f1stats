import type { Metadata } from "next";
import Link from "next/link";
import { GlobalSearch } from "../components/global-search";
import { getSearchData } from "../lib/f1-api";

export const metadata: Metadata = {
  title: "Busca | F1 Stats",
  description: "Busca global por pilotos, equipes, corridas e calendario.",
};

export const revalidate = 3600;

export default async function SearchPage() {
  const search = await getSearchData();
  const totalDrivers = search.items.filter((item) => item.type === "driver").length;
  const totalTeams = search.items.filter((item) => item.type === "team").length;
  const totalRaces = search.items.filter(
    (item) => item.type === "race" || item.type === "calendar",
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f2ec] text-[#161616]">
      <section className="bg-[#151515] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Link className="flex items-center gap-3" href="/">
              <div className="grid size-10 place-items-center rounded bg-[#e10600] font-black italic">
                F1
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
                Stats Center
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/70">
              <Link className="rounded px-3 py-2 hover:bg-white/10" href="/">
                Painel
              </Link>
              <Link
                className="rounded px-3 py-2 hover:bg-white/10"
                href="/calendario"
              >
                Calendario
              </Link>
            </nav>
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                {search.source === "api" ? "Jolpica F1 API" : "Fallback local"}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
                Busca global
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                Encontre rapidamente pilotos, equipes, corridas recentes e
                etapas do calendario em um unico lugar.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Metric label="Pilotos" value={totalDrivers.toString()} />
              <Metric label="Equipes" value={totalTeams.toString()} />
              <Metric label="Etapas" value={totalRaces.toString()} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <GlobalSearch items={search.items} />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/12 bg-white/[0.06] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
