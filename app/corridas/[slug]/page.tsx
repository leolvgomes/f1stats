import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  constructors,
  drivers,
  getRaceBySlug,
  recentResults,
} from "../../data/f1-data";

type RacePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return recentResults.map((result) => ({
    slug: result.slug,
  }));
}

export async function generateMetadata({
  params,
}: RacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const race = getRaceBySlug(slug);

  if (!race) {
    return {
      title: "Corrida nao encontrada | F1 Stats",
    };
  }

  return {
    title: `${race.race} | F1 Stats`,
    description: `Resumo e sessoes do ${race.race} no F1 Stats.`,
  };
}

export default async function RacePage({ params }: RacePageProps) {
  const { slug } = await params;
  const race = getRaceBySlug(slug);

  if (!race) {
    notFound();
  }

  const winningConstructor = constructors.find(
    (constructor) => constructor.name === race.winningTeam,
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
              href="/#resultados"
            >
              Voltar aos resultados
            </Link>
          </header>

          <div className="grid gap-8 py-12 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                R{race.round} / {race.country} / {race.date}
              </p>
              <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
                {race.race}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/68">
                {race.summary}
              </p>
            </div>

            <div className="rounded border border-white/12 bg-white/[0.06] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                Vencedor
              </p>
              <p className="mt-3 text-4xl font-black">{race.winner}</p>
              <p className="mt-2 text-white/62">{race.winningTeam}</p>
              {winningConstructor ? (
                <Link
                  className="mt-5 inline-flex rounded bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#151515] transition hover:bg-[#ffcc00]"
                  href={`/equipes/${winningConstructor.slug}`}
                >
                  Ver equipe
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="grid gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Sessoes
            </p>
            <h2 className="mt-2 text-3xl font-black">Resumo do fim de semana</h2>
            <div className="mt-6 grid gap-3">
              {race.sessions.map((session) => (
                <article className="rounded bg-[#f5f2ec] p-4" key={session.label}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-xl font-black">{session.label}</h3>
                    <span className="rounded bg-white px-3 py-2 text-sm font-black">
                      {session.team}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                    <PodiumSlot label="P1" value={session.winner} />
                    <PodiumSlot label="P2" value={session.second} />
                    <PodiumSlot label="P3" value={session.third} />
                  </dl>
                  <p className="mt-4 text-sm font-bold leading-6 text-black/58">
                    {session.note}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid content-start gap-6">
          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Circuito
            </p>
            <h2 className="mt-2 text-3xl font-black">{race.circuit}</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <InfoRow label="Pais" value={race.country} />
              <InfoRow label="Data" value={race.date} />
              <InfoRow label="Volta rapida" value={race.fastestLap} />
            </dl>
          </div>

          <div className="rounded border border-black/10 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
              Pilotos citados
            </p>
            <div className="mt-5 grid gap-3">
              {getMentionedDrivers(race).map((driverName) => {
                const driver = drivers.find(
                  (seasonDriver) => seasonDriver.name === driverName,
                );

                return driver ? (
                  <Link
                    className="rounded bg-[#f5f2ec] p-4 transition hover:bg-[#eee5d6]"
                    href={`/pilotos/${driver.slug}`}
                    key={driver.name}
                  >
                    <span className="block font-black">{driver.name}</span>
                    <span className="mt-1 block text-sm font-bold text-black/55">
                      {driver.team} / P{driver.position}
                    </span>
                  </Link>
                ) : (
                  <div className="rounded bg-[#f5f2ec] p-4" key={driverName}>
                    <span className="block font-black">{driverName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function getMentionedDrivers(race: NonNullable<ReturnType<typeof getRaceBySlug>>) {
  return Array.from(
    new Set(
      race.sessions.flatMap((session) => [
        session.winner,
        session.second,
        session.third,
      ]),
    ),
  );
}

function PodiumSlot({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white p-4">
      <dt className="text-xs font-bold uppercase tracking-[0.18em] text-black/42">
        {label}
      </dt>
      <dd className="mt-2 text-lg font-black">{value}</dd>
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
