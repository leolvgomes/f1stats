import type { RaceResult } from "../data/f1-data";

type RaceResultsProps = {
  results: RaceResult[];
};

export function RaceResults({ results }: RaceResultsProps) {
  return (
    <div className="rounded border border-black/10 bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
            Resultados
          </p>
          <h2 className="mt-2 text-3xl font-black">Ultimas corridas</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-black/55">
          Historico demo para testar cards, rankings e futuras integracoes com
          dados reais.
        </p>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {results.map((result) => (
          <article className="rounded bg-[#f5f2ec] p-4" key={result.race}>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-black text-black/45">
                R{result.round}
              </span>
              <span className="rounded bg-white px-2 py-1 text-xs font-black">
                {result.date}
              </span>
            </div>
            <h3 className="mt-3 text-xl font-black">{result.race}</h3>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-black/45">Vencedor</dt>
                <dd className="font-black">{result.winner}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-black/45">Equipe</dt>
                <dd className="font-black">{result.winningTeam}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="font-bold text-black/45">Volta rapida</dt>
                <dd className="font-black">{result.fastestLap}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
