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
  "Expandir API para resultados e qualificacao",
  "Criar filtros por etapa, circuito e pais",
  "Adicionar calendario completo",
  "Cobrir a camada de API com testes",
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
    <main className="min-h-screen bg-[#f5f2ec] text-[#161616]">
      <section className="border-b border-black/10 bg-[#151515] text-white">
        <div className="mx-auto flex min-h-[92vh] w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded bg-[#e10600] font-black italic">
                F1
              </div>
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-white/65">
                Stats Center
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/70">
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

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                Temporada demo
              </p>
              <h1 className="text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                F1 Stats para acompanhar a temporada de ponta a ponta.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Dashboard com standings, busca por piloto, filtros por equipe,
                calendario e comparativos. A estrutura ja esta preparada para
                trocar os dados de exemplo por uma API.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="rounded bg-[#e10600] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b80500]"
                  href="#pilotos"
                >
                  Explorar pilotos
                </a>
                <Link
                  className="rounded border border-white/20 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                  href="/buscar"
                >
                  Buscar stats
                </Link>
                <Link
                  className="rounded border border-white/20 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
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
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/45">
              {stat.label}
            </p>
            <p className="mt-3 text-4xl font-black">{stat.value}</p>
            <p className="mt-2 text-sm text-black/55">{stat.detail}</p>
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
            <p className="max-w-xl text-sm leading-6 text-black/55">
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
                  <span className="font-bold text-black/58">
                    {constructor.points} pts | {constructor.wins} vitorias
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded bg-[#eee9df]">
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
    <div className="relative overflow-hidden rounded border border-white/12 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#e10600] via-[#ffcc00] to-[#27f4d2]" />
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
            Lider
          </p>
          <h2 className="mt-3 text-4xl font-black">{leader.name}</h2>
          <p className="mt-2 text-white/62">{leader.team}</p>
          <p className="mt-4 inline-flex rounded bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/62">
            {dataSource === "api" ? "Ao vivo via" : "Fallback"} {sourceLabel}
          </p>
        </div>
        <div className="rounded bg-white px-4 py-3 text-right text-[#161616]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/45">
            Pts
          </p>
          <p className="text-3xl font-black">{leader.points}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3">
        <Metric label="Vitorias" value={leader.wins.toString()} />
        <Metric label="Podios" value={leader.podiums.toString()} />
      </div>

      <div className="mt-8 h-56 rounded bg-[#242424] p-5">
        <div className="flex h-full items-end gap-3">
          {drivers.slice(0, 6).map((driver) => (
            <div className="flex flex-1 flex-col items-center gap-3" key={driver.slug}>
              <div
                className="w-full rounded-t bg-[#e10600]"
                style={{
                  height: `${Math.max(28, (driver.points / leader.points) * 100)}%`,
                }}
              />
              <span className="text-xs font-bold text-white/60">
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
    <div className="rounded bg-white/10 p-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
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
