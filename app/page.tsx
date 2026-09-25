import Link from "next/link";
import { DriverComparison } from "./components/driver-comparison";
import { DriverExplorer } from "./components/driver-explorer";
import { RaceResults } from "./components/race-results";
import { SeasonInsights } from "./components/season-insights";
import {
  pointsProgressionBySeason,
  seasonOptions,
} from "./data/f1-data";
import { getDashboardData } from "./lib/f1-api";

export const revalidate = 3600;

const productRoadmap = [
  "Comparacao por circuito",
  "Deploy de producao",
  "Mais graficos por stint",
  "Testes unitarios dos mapeadores",
];

export default async function Home() {
  const dashboard = await getDashboardData();
  const { constructors, drivers, recentResults, stats, upcomingRaces } =
    dashboard;
  const maxConstructorPoints = Math.max(
    ...constructors.map((constructor) => constructor.points),
  );
  const teams = Array.from(new Set(drivers.map((driver) => driver.team))).sort();

  const quickStats = [
    {
      label: "Corridas",
      value: stats.racesDone.toString(),
      detail: `${stats.racesTotal} no calendario`,
    },
    {
      label: "Pilotos",
      value: stats.driverCount.toString(),
      detail: `${stats.teamCount} equipes`,
    },
    {
      label: "Disputa P1",
      value: `${stats.leaderGap} pts`,
      detail: "entre 1o e 2o",
    },
    {
      label: "Vitorias",
      value: stats.winnerCount.toString(),
      detail: "pilotos vencedores",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3f3f3] text-[#15151e]">
      <section className="f1-official-header">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded bg-white font-black italic text-[#e10600]">
              F1
            </div>
            <span className="text-sm font-black uppercase tracking-[0.18em]">
              Stats Center
            </span>
          </div>
          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-white/80 sm:inline">
            Race data dashboard
          </span>
        </div>
      </section>

      <section className="bg-[#15151e] text-white">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-3 py-4">
            <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-white/80">
              <a className="rounded px-3 py-2 hover:bg-white/10" href="#pilotos">
                Pilotos
              </a>
              <a className="rounded px-3 py-2 hover:bg-white/10" href="#equipes">
                Equipes
              </a>
              <Link className="rounded px-3 py-2 hover:bg-white/10" href="/calendario">
                Calendario
              </Link>
              <Link className="rounded px-3 py-2 hover:bg-white/10" href="/buscar">
                Busca
              </Link>
              <a className="rounded px-3 py-2 hover:bg-white/10" href="#temporada">
                Analise
              </a>
            </nav>
          </header>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <div className="f1-results-shell grid gap-8 bg-white p-5 sm:p-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#e10600]">
                Temporada 2026
              </p>
              <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.92] tracking-normal sm:text-6xl lg:text-7xl">
                Resultados, standings e calendario em um so painel.
              </h1>
              <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-[#62626d]">
                Uma interface limpa para consultar pilotos, equipes, corridas,
                busca global e dados da temporada com fallback local quando a
                API externa nao estiver disponivel.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="f1-pill-active px-5 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:bg-[#b80500]"
                  href="#pilotos"
                >
                  Explorar pilotos
                </a>
                <Link
                  className="f1-pill px-5 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:border-[#e10600]"
                  href="/buscar"
                >
                  Buscar stats
                </Link>
                <Link
                  className="f1-pill px-5 py-3 text-sm font-black uppercase tracking-[0.12em] transition hover:border-[#e10600]"
                  href="/calendario"
                >
                  Proximas corridas
                </Link>
              </div>
            </div>

            <HeroLeaderCard
              dataSource={dashboard.source}
              sourceLabel={dashboard.sourceLabel}
              drivers={drivers}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-10">
        {quickStats.map((stat) => (
          <div className="rounded border border-black/10 bg-white p-5" key={stat.label}>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#62626d]">
              {stat.label}
            </p>
            <p className="mt-3 text-4xl font-black">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-[#62626d]">{stat.detail}</p>
          </div>
        ))}
      </section>

      <SeasonInsights
        progressionsBySeason={pointsProgressionBySeason}
        seasons={seasonOptions}
      />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-14 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
        <DriverExplorer drivers={drivers} teams={teams} />

        <aside className="grid content-start gap-6">
          <DriverComparison drivers={drivers} />
          <CalendarPanel upcomingRaces={upcomingRaces} />
          <RoadmapPanel />
        </aside>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"
        id="equipes"
      >
        <div className="rounded border border-black/10 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
                Construtores
              </p>
              <h2 className="mt-2 text-3xl font-black">Forca das equipes</h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-[#62626d]">
              Barras proporcionais aos pontos para visualizar rapidamente o
              equilibrio do campeonato.
            </p>
          </div>
          <div className="mt-6 grid gap-4">
            {constructors.map((constructor) => (
              <div key={constructor.name}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <Link
                    className="font-black transition hover:text-[#e10600]"
                    href={`/equipes/${constructor.slug}`}
                  >
                    {constructor.position}. {constructor.name}
                  </Link>
                  <span className="font-bold text-[#62626d]">
                    {constructor.points} pts | {constructor.wins} vitorias
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded bg-[#ededed]">
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${(constructor.points / maxConstructorPoints) * 100}%`,
                      backgroundColor: constructor.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"
        id="resultados"
      >
        <RaceResults results={recentResults} />
      </section>
    </main>
  );
}

function HeroLeaderCard({
  dataSource,
  drivers,
  sourceLabel,
}: {
  dataSource: "api" | "mock";
  drivers: typeof import("./data/f1-data").drivers;
  sourceLabel: string;
}) {
  const leader = drivers[0];

  return (
    <div className="relative overflow-hidden rounded border border-black/10 bg-[#f8f8f8] p-5">
      <div className="absolute inset-x-0 top-0 h-2 bg-[#e10600]" />
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#e10600]">
            Leader
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase">{leader.name}</h2>
          <p className="mt-2 font-semibold text-[#62626d]">{leader.team}</p>
          <p className="mt-4 inline-flex rounded bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#62626d]">
            {dataSource === "api" ? "Ao vivo via" : "Fallback"} {sourceLabel}
          </p>
        </div>
        <div className="rounded bg-[#15151e] px-4 py-3 text-right text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">
            Pts
          </p>
          <p className="text-3xl font-black">{leader.points}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3">
        <Metric label="Vitorias" value={leader.wins.toString()} />
        <Metric label="Podios" value={leader.podiums.toString()} />
      </div>

      <div className="mt-8 h-56 rounded bg-white p-5">
        <div className="flex h-full items-end gap-3">
          {drivers.slice(0, 6).map((driver) => (
            <div className="flex flex-1 flex-col items-center gap-3" key={driver.slug}>
              <div
                className="w-full rounded-t bg-[#e10600]"
                style={{
                  height: `${Math.max(28, (driver.points / leader.points) * 100)}%`,
                }}
              />
              <span className="text-xs font-bold text-[#62626d]">
                {driver.country}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#62626d]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function CalendarPanel({
  upcomingRaces,
}: {
  upcomingRaces: typeof import("./data/f1-data").upcomingRaces;
}) {
  return (
    <div className="rounded border border-black/10 bg-white p-5" id="calendario">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
        Calendario
      </p>
      <h2 className="mt-2 text-3xl font-black">Proximas etapas</h2>
      <div className="mt-5 grid gap-3">
        {upcomingRaces.map((race) => (
          <div className="rounded bg-[#f5f2ec] p-4" key={race.name}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-black text-black/45">
                R{race.round}
              </span>
              <span className="rounded bg-white px-2 py-1 text-xs font-black">
                {race.status === "next" ? "Proxima" : race.date}
              </span>
            </div>
            <p className="mt-3 font-black">{race.name}</p>
            <p className="mt-1 text-sm text-black/58">{race.circuit}</p>
            <p className="mt-1 text-sm text-black/45">
              {race.country} / {race.date}
            </p>
          </div>
        ))}
      </div>
      <Link
        className="mt-5 inline-flex rounded bg-[#151515] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#e10600]"
        href="/calendario"
      >
        Ver calendario completo
      </Link>
    </div>
  );
}

function RoadmapPanel() {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
        Proximos passos
      </p>
      <h2 className="mt-2 text-3xl font-black">Backlog</h2>
      <ol className="mt-5 grid gap-3">
        {productRoadmap.map((item, index) => (
          <li className="flex gap-3 rounded bg-[#f5f2ec] p-3" key={item}>
            <span className="grid size-7 shrink-0 place-items-center rounded bg-[#151515] text-sm font-black text-white">
              {index + 1}
            </span>
            <span className="text-sm font-bold leading-6 text-black/68">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
