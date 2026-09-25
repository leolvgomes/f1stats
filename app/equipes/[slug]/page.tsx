import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RaceResults } from "../../components/race-results";
import {
  constructors,
  getConstructorBySlug,
  getDriversByTeam,
  getResultsByTeam,
} from "../../data/f1-data";

type TeamPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return constructors.map((constructor) => ({
    slug: constructor.slug,
  }));
}

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const constructor = getConstructorBySlug(slug);

  if (!constructor) {
    return {
      title: "Equipe nao encontrada | F1 Stats",
    };
  }

  return {
    title: `${constructor.name} | F1 Stats`,
    description: `Estatisticas da ${constructor.name} na temporada demo do F1 Stats.`,
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const constructor = getConstructorBySlug(slug);

  if (!constructor) {
    notFound();
  }

  const teamDrivers = getDriversByTeam(constructor.name);
  const teamResults = getResultsByTeam(constructor.name);
  const pointsLeader = Math.max(...constructors.map((team) => team.points));
  const driverPointsTotal = teamDrivers.reduce(
    (total, driver) => total + driver.points,
    0,
  );

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
              href="/#equipes"
            >
              Voltar as equipes
            </Link>
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                P{constructor.position} / {constructor.base}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
                {constructor.name}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                {constructor.summary}
              </p>
            </div>

            <div className="rounded border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Campeonato de construtores
              </p>
              <p className="mt-3 text-6xl font-black">{constructor.points}</p>
              <div className="mt-5 h-4 overflow-hidden rounded bg-white/10">
                <div
                  className="h-full rounded"
                  style={{
                    backgroundColor: constructor.color,
                    width: `${(constructor.points / pointsLeader) * 100}%`,
                  }}
                />
              </div>
              <p className="mt-3 text-sm font-bold text-white/58">
                {constructor.wins} vitorias e {constructor.podiums} podios na
                temporada demo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="grid gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Pilotos
            </p>
            <h2 className="mt-2 text-3xl font-black">Line-up</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {teamDrivers.map((driver) => (
                <Link
                  className="rounded bg-[#f5f2ec] p-4 transition hover:bg-[#eee5d6]"
                  href={`/pilotos/${driver.slug}`}
                  key={driver.slug}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-black">{driver.name}</p>
                      <p className="mt-1 text-sm font-bold text-black/55">
                        #{driver.number} / {driver.country}
                      </p>
                    </div>
                    <span className="rounded bg-white px-3 py-2 text-sm font-black">
                      P{driver.position}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <MiniStat label="Pts" value={driver.points.toString()} />
                    <MiniStat label="Wins" value={driver.wins.toString()} />
                    <MiniStat label="Podios" value={driver.podiums.toString()} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <RaceResults results={teamResults} />
        </div>

        <aside className="grid content-start gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Operacao
            </p>
            <h2 className="mt-2 text-3xl font-black">Base tecnica</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <InfoRow label="Sede" value={constructor.base} />
              <InfoRow label="Chefe" value={constructor.teamPrincipal} />
              <InfoRow
                label="Pontos pilotos"
                value={`${driverPointsTotal} pts`}
              />
              <InfoRow
                label="Participacao"
                value={`${Math.round((constructor.points / pointsLeader) * 100)}% do lider`}
              />
            </dl>
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Grid
            </p>
            <h2 className="mt-2 text-3xl font-black">Rivais proximos</h2>
            <div className="mt-5 grid gap-3">
              {constructors
                .filter((team) => team.slug !== constructor.slug)
                .slice(0, 3)
                .map((team) => (
                  <Link
                    className="rounded bg-[#f5f2ec] p-4 transition hover:bg-[#eee5d6]"
                    href={`/equipes/${team.slug}`}
                    key={team.slug}
                  >
                    <span className="block font-black">{team.name}</span>
                    <span className="mt-1 block text-sm font-bold text-black/55">
                      {team.points} pts / P{team.position}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/42">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="font-bold text-black/45">{label}</dt>
      <dd className="text-right font-black">{value}</dd>
    </div>
  );
}
