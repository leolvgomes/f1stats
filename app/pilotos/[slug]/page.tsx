import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  constructors,
  drivers,
  getDriverBySlug,
  getDriversByTeam,
  trendLabel,
} from "../../data/f1-data";

type DriverPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return drivers.map((driver) => ({
    slug: driver.slug,
  }));
}

export async function generateMetadata({
  params,
}: DriverPageProps): Promise<Metadata> {
  const { slug } = await params;
  const driver = getDriverBySlug(slug);

  if (!driver) {
    return {
      title: "Piloto nao encontrado | F1 Stats",
    };
  }

  return {
    title: `${driver.name} | F1 Stats`,
    description: `Estatisticas de ${driver.name} na temporada demo do F1 Stats.`,
  };
}

export default async function DriverPage({ params }: DriverPageProps) {
  const { slug } = await params;
  const driver = getDriverBySlug(slug);

  if (!driver) {
    notFound();
  }

  const team = constructors.find(
    (constructor) => constructor.name === driver.team,
  );
  const teammates = getDriversByTeam(driver.team).filter(
    (teamDriver) => teamDriver.slug !== driver.slug,
  );
  const pointsLeader = Math.max(...drivers.map((seasonDriver) => seasonDriver.points));

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
              href="/#pilotos"
            >
              Voltar aos pilotos
            </Link>
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                #{driver.number} / {driver.country}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
                {driver.name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                {driver.summary}
              </p>
            </div>

            <div className="rounded border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Posicao no campeonato
              </p>
              <p className="mt-3 text-6xl font-black">P{driver.position}</p>
              <div className="mt-5 h-4 overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded bg-[#e10600]"
                  style={{ width: `${(driver.points / pointsLeader) * 100}%` }}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-white/58">
                {driver.points} pontos de {pointsLeader} possiveis na lideranca
                atual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="grid gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Resumo
            </p>
            <h2 className="mt-2 text-3xl font-black">Temporada em numeros</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Pontos" value={driver.points.toString()} />
              <StatCard label="Vitorias" value={driver.wins.toString()} />
              <StatCard label="Podios" value={driver.podiums.toString()} />
              <StatCard
                label="Voltas rapidas"
                value={driver.fastestLaps.toString()}
              />
            </div>
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Performance
            </p>
            <h2 className="mt-2 text-3xl font-black">Indicadores chave</h2>
            <div className="mt-6 grid gap-4">
              <PerformanceRow
                label="Media de chegada"
                value={driver.averageFinish}
                max={10}
                suffix="pos."
              />
              <PerformanceRow
                label="Ranking de classificacao"
                value={driver.qualifyingRank}
                max={10}
                suffix="o"
                reverse
              />
              <PerformanceRow
                label="Abandonos"
                value={driver.dnfs}
                max={5}
                suffix="DNFs"
                reverse
              />
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Equipe
            </p>
            {team ? (
              <Link
                className="mt-2 block text-3xl font-black transition hover:text-[#e10600]"
                href={`/equipes/${team.slug}`}
              >
                {driver.team}
              </Link>
            ) : (
              <h2 className="mt-2 text-3xl font-black">{driver.team}</h2>
            )}
            <div className="mt-5 h-3 rounded" style={{ backgroundColor: team?.color }} />
            <p className="mt-4 text-sm font-bold text-black/58">
              Forma atual: {trendLabel[driver.trend]}
            </p>
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Companheiro
            </p>
            {teammates.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {teammates.map((teammate) => (
                  <Link
                    className="rounded bg-[#f5f2ec] p-4 transition hover:bg-[#eee5d6]"
                    href={`/pilotos/${teammate.slug}`}
                    key={teammate.slug}
                  >
                    <span className="block font-black">{teammate.name}</span>
                    <span className="mt-1 block text-sm font-bold text-black/55">
                      {teammate.points} pts / P{teammate.position}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-bold text-black/55">
                Nenhum companheiro listado nos dados atuais.
              </p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-[#f5f2ec] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function PerformanceRow({
  label,
  max,
  reverse = false,
  suffix,
  value,
}: {
  label: string;
  max: number;
  reverse?: boolean;
  suffix: string;
  value: number;
}) {
  const score = reverse ? max - value : value;
  const width = Math.max(8, (score / max) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-bold text-black/62">
        <span>{label}</span>
        <span>
          {value} {suffix}
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded bg-[#eee9df]">
        <div
          className="h-full rounded bg-[#e10600]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
