import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  constructors,
  drivers,
  recentResults,
  type QualifyingClassification,
  type RaceClassification,
  type RaceResult,
} from "../../data/f1-data";
import { getCalendarData, getRaceDetails } from "../../lib/f1-api";

type RacePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  const mockSlugs = recentResults.map((result) => result.slug);

  try {
    const calendar = await getCalendarData();
    const calendarSlugs = calendar.races
      .map((race) => race.slug)
      .filter((slug): slug is string => Boolean(slug));

    return Array.from(new Set([...mockSlugs, ...calendarSlugs])).map((slug) => ({
      slug,
    }));
  } catch {
    return mockSlugs.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({
  params,
}: RacePageProps): Promise<Metadata> {
  const { slug } = await params;
  const details = await getRaceDetails(slug);

  if (!details) {
    return {
      title: "Corrida nao encontrada | F1 Stats",
    };
  }

  return {
    title: `${details.race.race} | F1 Stats`,
    description: `Resumo e sessoes do ${details.race.race} no F1 Stats.`,
  };
}

export default async function RacePage({ params }: RacePageProps) {
  const { slug } = await params;
  const details = await getRaceDetails(slug);

  if (!details) {
    notFound();
  }

  const { race } = details;
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
              <p className="mt-4 inline-flex rounded bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/62">
                {details.source === "api" ? "Ao vivo via" : "Fallback"}{" "}
                {details.sourceLabel}
              </p>
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

          {details.raceResults.length > 0 ? (
            <>
              <RaceAnalytics results={details.raceResults} />
              <ClassificationTable
                results={details.raceResults}
                title="Resultado da corrida"
              />
            </>
          ) : null}

          {details.qualifyingResults.length > 0 ? (
            <QualifyingTable results={details.qualifyingResults} />
          ) : null}

          {details.sprintResults.length > 0 ? (
            <ClassificationTable
              results={details.sprintResults}
              title="Resultado da sprint"
            />
          ) : null}
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

          {details.scheduleSessions.length > 0 ? (
            <div className="rounded border border-black/10 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
                Horarios
              </p>
              <h2 className="mt-2 text-3xl font-black">Fim de semana</h2>
              <div className="mt-5 grid gap-3">
                {details.scheduleSessions.map((session) => (
                  <div
                    className="rounded bg-[#f5f2ec] p-4"
                    key={`${session.label}-${session.date}`}
                  >
                    <p className="font-black">{session.label}</p>
                    <p className="mt-1 text-sm font-bold text-black/55">
                      {session.date}
                      {session.time ? ` / ${session.time}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

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

function ClassificationTable({
  results,
  title,
}: {
  results: RaceClassification[];
  title: string;
}) {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
        Classificacao
      </p>
      <h2 className="mt-2 text-3xl font-black">{title}</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/42">
              <th className="py-3 pr-4">Pos</th>
              <th className="py-3 pr-4">Piloto</th>
              <th className="py-3 pr-4">Equipe</th>
              <th className="py-3 pr-4">Grid</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr className="border-b border-black/5 last:border-b-0" key={`${title}-${result.position}-${result.driver}`}>
                <td className="py-3 pr-4 font-black">P{result.position}</td>
                <td className="py-3 pr-4 font-bold">{result.driver}</td>
                <td className="py-3 pr-4 text-black/58">{result.team}</td>
                <td className="py-3 pr-4 text-black/58">
                  {result.grid ? `P${result.grid}` : "-"}
                </td>
                <td className="py-3 pr-4 text-black/58">
                  {result.time ?? result.status ?? "-"}
                </td>
                <td className="py-3 text-right font-black">
                  {result.points ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RaceAnalytics({ results }: { results: RaceClassification[] }) {
  const teamPoints = getTeamPoints(results);
  const maxTeamPoints = Math.max(...teamPoints.map((team) => team.points), 1);
  const gridMovers = results
    .filter((result) => typeof result.grid === "number" && result.grid > 0)
    .map((result) => ({
      ...result,
      delta: (result.grid ?? result.position) - result.position,
    }))
    .sort((first, second) => Math.abs(second.delta) - Math.abs(first.delta))
    .slice(0, 6);

  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
            Graficos
          </p>
          <h2 className="mt-2 text-3xl font-black">Leitura da corrida</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/55">
          Pontos por equipe e variacao entre largada e chegada quando a API
          informa o grid.
        </p>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-black/45">
            Pontos por equipe
          </h3>
          <div className="mt-4 grid gap-3">
            {teamPoints.map((team) => (
              <div key={team.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-black">{team.name}</span>
                  <span className="font-bold text-black/50">
                    {team.points} pts
                  </span>
                </div>
                <div className="h-4 overflow-hidden rounded bg-[#eee9df]">
                  <div
                    className="h-full rounded bg-[#e10600]"
                    style={{
                      width: `${Math.max(8, (team.points / maxTeamPoints) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-black/45">
            Grid vs chegada
          </h3>
          {gridMovers.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {gridMovers.map((result) => (
                <div
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded bg-[#f5f2ec] p-3"
                  key={`delta-${result.driver}`}
                >
                  <div>
                    <p className="font-black">{result.driver}</p>
                    <p className="mt-1 text-xs font-bold text-black/45">
                      Largou P{result.grid} / chegou P{result.position}
                    </p>
                  </div>
                  <span
                    className={`rounded px-3 py-2 text-sm font-black ${
                      result.delta >= 0
                        ? "bg-[#1f8f4d] text-white"
                        : "bg-[#e10600] text-white"
                    }`}
                  >
                    {result.delta >= 0 ? "+" : ""}
                    {result.delta}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded bg-[#f5f2ec] p-5 text-sm font-bold leading-6 text-black/55">
              O comparativo de grid aparece automaticamente quando a API
              fornece as posicoes de largada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QualifyingTable({
  results,
}: {
  results: QualifyingClassification[];
}) {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
        Largada
      </p>
      <h2 className="mt-2 text-3xl font-black">Resultado da classificacao</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-black/42">
              <th className="py-3 pr-4">Pos</th>
              <th className="py-3 pr-4">Piloto</th>
              <th className="py-3 pr-4">Equipe</th>
              <th className="py-3 pr-4">Q1</th>
              <th className="py-3 pr-4">Q2</th>
              <th className="py-3">Q3</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr className="border-b border-black/5 last:border-b-0" key={`quali-${result.position}-${result.driver}`}>
                <td className="py-3 pr-4 font-black">P{result.position}</td>
                <td className="py-3 pr-4 font-bold">{result.driver}</td>
                <td className="py-3 pr-4 text-black/58">{result.team}</td>
                <td className="py-3 pr-4 text-black/58">{result.q1 ?? "-"}</td>
                <td className="py-3 pr-4 text-black/58">{result.q2 ?? "-"}</td>
                <td className="py-3 text-black/58">{result.q3 ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getMentionedDrivers(race: RaceResult) {
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

function getTeamPoints(results: RaceClassification[]) {
  const podiumFallback = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const pointsByTeam = new Map<string, number>();

  results.forEach((result, index) => {
    const points = result.points ?? podiumFallback[index] ?? 0;

    pointsByTeam.set(result.team, (pointsByTeam.get(result.team) ?? 0) + points);
  });

  return Array.from(pointsByTeam.entries())
    .map(([name, points]) => ({ name, points }))
    .sort((first, second) => second.points - first.points);
}
