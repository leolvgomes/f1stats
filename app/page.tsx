type Driver = {
  position: number;
  name: string;
  team: string;
  country: string;
  points: number;
  wins: number;
  podiums: number;
  trend: "up" | "down" | "stable";
};

type Constructor = {
  position: number;
  name: string;
  points: number;
  wins: number;
  color: string;
};

type Race = {
  round: number;
  name: string;
  circuit: string;
  date: string;
  country: string;
};

const drivers: Driver[] = [
  {
    position: 1,
    name: "Max Verstappen",
    team: "Red Bull Racing",
    country: "NED",
    points: 437,
    wins: 11,
    podiums: 16,
    trend: "stable",
  },
  {
    position: 2,
    name: "Lando Norris",
    team: "McLaren",
    country: "GBR",
    points: 374,
    wins: 4,
    podiums: 13,
    trend: "up",
  },
  {
    position: 3,
    name: "Charles Leclerc",
    team: "Ferrari",
    country: "MON",
    points: 356,
    wins: 3,
    podiums: 12,
    trend: "up",
  },
  {
    position: 4,
    name: "Oscar Piastri",
    team: "McLaren",
    country: "AUS",
    points: 292,
    wins: 2,
    podiums: 8,
    trend: "stable",
  },
  {
    position: 5,
    name: "Carlos Sainz",
    team: "Ferrari",
    country: "ESP",
    points: 290,
    wins: 2,
    podiums: 9,
    trend: "down",
  },
];

const constructors: Constructor[] = [
  { position: 1, name: "McLaren", points: 666, wins: 6, color: "#ff8700" },
  { position: 2, name: "Ferrari", points: 646, wins: 5, color: "#e10600" },
  {
    position: 3,
    name: "Red Bull Racing",
    points: 589,
    wins: 11,
    color: "#3671c6",
  },
  { position: 4, name: "Mercedes", points: 468, wins: 4, color: "#27f4d2" },
];

const upcomingRaces: Race[] = [
  {
    round: 18,
    name: "Singapore GP",
    circuit: "Marina Bay Street Circuit",
    date: "04 Oct",
    country: "Singapore",
  },
  {
    round: 19,
    name: "United States GP",
    circuit: "Circuit of The Americas",
    date: "18 Oct",
    country: "USA",
  },
  {
    round: 20,
    name: "Mexico City GP",
    circuit: "Autodromo Hermanos Rodriguez",
    date: "25 Oct",
    country: "Mexico",
  },
];

const quickStats = [
  { label: "Corridas", value: "17", detail: "24 no calendario" },
  { label: "Pilotos", value: "20", detail: "10 equipes" },
  { label: "Disputa P1", value: "63 pts", detail: "entre 1o e 2o" },
  { label: "Vitorias", value: "8", detail: "pilotos vencedores" },
];

const trendLabel = {
  up: "Subindo",
  down: "Caindo",
  stable: "Estavel",
};

export default function Home() {
  const leader = drivers[0];
  const maxConstructorPoints = Math.max(
    ...constructors.map((constructor) => constructor.points),
  );

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
              <a className="rounded px-3 py-2 hover:bg-white/10" href="#calendario">
                Calendario
              </a>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-[#ffcc00]">
                Temporada 2026
              </p>
              <h1 className="text-5xl font-black leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
                F1 Stats para acompanhar a temporada de ponta a ponta.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
                Dashboard inicial com lideranca do campeonato, ranking de
                pilotos, construtores, calendario e comparativos prontos para
                receber dados reais.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  className="rounded bg-[#e10600] px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b80500]"
                  href="#pilotos"
                >
                  Ver standings
                </a>
                <a
                  className="rounded border border-white/20 px-5 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
                  href="#calendario"
                >
                  Proximas corridas
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded border border-white/12 bg-white/[0.06] p-5 shadow-2xl shadow-black/30">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#e10600] via-[#ffcc00] to-[#27f4d2]" />
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
                    Lider
                  </p>
                  <h2 className="mt-3 text-4xl font-black">{leader.name}</h2>
                  <p className="mt-2 text-white/62">{leader.team}</p>
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
                  {drivers.map((driver) => (
                    <div
                      className="flex flex-1 flex-col items-center gap-3"
                      key={driver.name}
                    >
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

      <section
        className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-14 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10"
        id="pilotos"
      >
        <div className="rounded border border-black/10 bg-white">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 p-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e10600]">
                Campeonato
              </p>
              <h2 className="mt-2 text-3xl font-black">Pilotos</h2>
            </div>
            <span className="rounded bg-[#f5f2ec] px-3 py-2 text-sm font-bold text-black/60">
              Dados de exemplo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-[#f7f7f7] text-xs uppercase tracking-[0.14em] text-black/45">
                <tr>
                  <th className="px-5 py-4">Pos</th>
                  <th className="px-5 py-4">Piloto</th>
                  <th className="px-5 py-4">Equipe</th>
                  <th className="px-5 py-4">Pts</th>
                  <th className="px-5 py-4">Vitorias</th>
                  <th className="px-5 py-4">Forma</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr className="border-t border-black/8" key={driver.name}>
                    <td className="px-5 py-4 text-xl font-black">
                      {driver.position}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-black">{driver.name}</div>
                      <div className="text-sm text-black/48">{driver.country}</div>
                    </td>
                    <td className="px-5 py-4 text-black/65">{driver.team}</td>
                    <td className="px-5 py-4 font-black">{driver.points}</td>
                    <td className="px-5 py-4">{driver.wins}</td>
                    <td className="px-5 py-4">
                      <span className="rounded bg-[#f5f2ec] px-3 py-1 text-sm font-bold">
                        {trendLabel[driver.trend]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="rounded border border-black/10 bg-[#151515] p-5 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffcc00]">
              Comparativo
            </p>
            <h2 className="mt-2 text-3xl font-black">Norris vs Leclerc</h2>
            <div className="mt-6 grid gap-4">
              <CompareBar label="Pontos" left={374} right={356} />
              <CompareBar label="Vitorias" left={4} right={3} />
              <CompareBar label="Podios" left={13} right={12} />
            </div>
          </div>

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
                      {race.date}
                    </span>
                  </div>
                  <p className="mt-3 font-black">{race.name}</p>
                  <p className="mt-1 text-sm text-black/58">{race.circuit}</p>
                  <p className="mt-1 text-sm text-black/45">{race.country}</p>
                </div>
              ))}
            </div>
          </div>
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
                  <span className="font-black">
                    {constructor.position}. {constructor.name}
                  </span>
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
    </main>
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

function CompareBar({
  label,
  left,
  right,
}: {
  label: string;
  left: number;
  right: number;
}) {
  const total = left + right;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold text-white/62">
        <span>{label}</span>
        <span>
          {left} / {right}
        </span>
      </div>
      <div className="flex h-4 overflow-hidden rounded bg-white/10">
        <div
          className="bg-[#ff8700]"
          style={{ width: `${(left / total) * 100}%` }}
        />
        <div
          className="bg-[#e10600]"
          style={{ width: `${(right / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
