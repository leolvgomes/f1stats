import type { Metadata } from "next";
import Link from "next/link";
import { CalendarList } from "../components/calendar-list";
import { getCalendarData } from "../lib/f1-api";

export const metadata: Metadata = {
  title: "Calendario | F1 Stats",
  description: "Calendario completo da temporada no F1 Stats.",
};

export const revalidate = 3600;

export default async function CalendarPage() {
  const calendar = await getCalendarData();
  const completed = calendar.races.filter(
    (race) => race.status === "completed",
  ).length;
  const nextRace = calendar.races.find((race) => race.status === "next");

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
            <Link
              className="rounded border border-white/20 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
              href="/"
            >
              Voltar ao painel
            </Link>
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                {calendar.source === "api" ? calendar.sourceLabel : "Fallback local"}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
                Calendario
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                Uma visao pesquisavel das etapas da temporada, pronta para usar
                dados reais quando a API estiver disponivel.
              </p>
            </div>

            <div className="rounded border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Proxima etapa
              </p>
              <p className="mt-3 text-4xl font-black">
                {nextRace?.name ?? "Nao definida"}
              </p>
              <p className="mt-2 text-white/62">
                {completed} de {calendar.races.length} etapas concluidas
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <CalendarList races={calendar.races} />
      </section>
    </main>
  );
}
