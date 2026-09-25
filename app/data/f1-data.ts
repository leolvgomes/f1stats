export type DriverTrend = "up" | "down" | "stable";

export type Driver = {
  position: number;
  name: string;
  slug: string;
  number: number;
  team: string;
  country: string;
  points: number;
  wins: number;
  podiums: number;
  dnfs: number;
  fastestLaps: number;
  averageFinish: number;
  qualifyingRank: number;
  trend: DriverTrend;
  summary: string;
};

export type Constructor = {
  position: number;
  name: string;
  slug: string;
  base: string;
  teamPrincipal: string;
  points: number;
  wins: number;
  podiums: number;
  color: string;
  summary: string;
};

export type Race = {
  round: number;
  name: string;
  circuit: string;
  date: string;
  country: string;
  status: "next" | "upcoming";
  sessions?: RaceWeekendSession[];
};

export type CalendarRace = Omit<Race, "status"> & {
  slug?: string;
  status: "completed" | "next" | "upcoming";
};

export type RaceWeekendSession = {
  date: string;
  label: string;
  time?: string;
  type:
    | "practice"
    | "qualifying"
    | "sprint"
    | "sprint-qualifying"
    | "race";
};

export type RaceResult = {
  round: number;
  slug: string;
  race: string;
  circuit: string;
  country: string;
  winner: string;
  winningTeam: string;
  fastestLap: string;
  date: string;
  summary: string;
  sessions: RaceSessionResult[];
};

export type RaceClassification = {
  position: number;
  driver: string;
  team: string;
  grid?: number;
  laps?: number;
  points?: number;
  status?: string;
  time?: string;
};

export type QualifyingClassification = {
  position: number;
  driver: string;
  team: string;
  q1?: string;
  q2?: string;
  q3?: string;
};

export type SessionType = "race" | "qualifying" | "sprint";

export type RaceSessionResult = {
  type: SessionType;
  label: string;
  winner: string;
  team: string;
  second: string;
  third: string;
  note: string;
};

export type SeasonOption = {
  year: string;
  label: string;
  racesDone: number;
  racesTotal: number;
  leader: string;
  leaderPoints: number;
  runnerUp: string;
  runnerUpPoints: number;
  winners: number;
};

export type PointsProgression = {
  driver: string;
  color: string;
  points: number[];
};

export const drivers: Driver[] = [
  {
    position: 1,
    name: "Kimi Antonelli",
    slug: "kimi-antonelli",
    number: 12,
    team: "Mercedes",
    country: "ITA",
    points: 292,
    wins: 6,
    podiums: 10,
    dnfs: 1,
    fastestLaps: 4,
    averageFinish: 2.8,
    qualifyingRank: 1,
    trend: "up",
    summary:
      "Lider atual do campeonato, com sequencia forte de vitorias e a Mercedes comandando a tabela.",
  },
  {
    position: 2,
    name: "George Russell",
    slug: "george-russell",
    number: 63,
    team: "Mercedes",
    country: "GBR",
    points: 211,
    wins: 2,
    podiums: 7,
    dnfs: 0,
    fastestLaps: 2,
    averageFinish: 4.1,
    qualifyingRank: 4,
    trend: "stable",
    summary:
      "Consistente e decisivo para a lideranca da Mercedes nos construtores.",
  },
  {
    position: 3,
    name: "Lewis Hamilton",
    slug: "lewis-hamilton",
    number: 44,
    team: "Ferrari",
    country: "GBR",
    points: 191,
    wins: 3,
    podiums: 6,
    dnfs: 0,
    fastestLaps: 2,
    averageFinish: 4.6,
    qualifyingRank: 5,
    trend: "up",
    summary:
      "Primeira temporada forte pela Ferrari, com vitorias e alto volume de pontos.",
  },
  {
    position: 4,
    name: "Lando Norris",
    slug: "lando-norris",
    number: 4,
    team: "McLaren",
    country: "GBR",
    points: 186,
    wins: 2,
    podiums: 7,
    dnfs: 1,
    fastestLaps: 3,
    averageFinish: 4.8,
    qualifyingRank: 3,
    trend: "stable",
    summary:
      "Segue como principal nome da McLaren na briga por vitorias e podios.",
  },
  {
    position: 5,
    name: "Charles Leclerc",
    slug: "charles-leclerc",
    number: 16,
    team: "Ferrari",
    country: "MON",
    points: 167,
    wins: 2,
    podiums: 6,
    dnfs: 1,
    fastestLaps: 3,
    averageFinish: 5.1,
    qualifyingRank: 2,
    trend: "stable",
    summary:
      "Forte em classificacao e ainda muito eficiente quando a Ferrari acerta a janela.",
  },
  {
    position: 6,
    name: "Max Verstappen",
    slug: "max-verstappen",
    number: 1,
    team: "Red Bull Racing",
    country: "NED",
    points: 145,
    wins: 1,
    podiums: 5,
    dnfs: 2,
    fastestLaps: 2,
    averageFinish: 5.8,
    qualifyingRank: 6,
    trend: "down",
    summary:
      "Ainda competitivo, mas com Red Bull abaixo da Mercedes, Ferrari e McLaren no campeonato.",
  },
  {
    position: 7,
    name: "Oscar Piastri",
    slug: "oscar-piastri",
    number: 81,
    team: "McLaren",
    country: "AUS",
    points: 120,
    wins: 0,
    podiums: 3,
    dnfs: 1,
    fastestLaps: 1,
    averageFinish: 6.6,
    qualifyingRank: 7,
    trend: "stable",
    summary:
      "Boa pontuacao de apoio para a McLaren, ainda buscando mais fins de semana completos.",
  },
  {
    position: 8,
    name: "Isack Hadjar",
    slug: "isack-hadjar",
    number: 6,
    team: "Red Bull Racing",
    country: "FRA",
    points: 71,
    wins: 0,
    podiums: 1,
    dnfs: 2,
    fastestLaps: 1,
    averageFinish: 8.2,
    qualifyingRank: 8,
    trend: "up",
    summary:
      "Campanha de destaque, fechando o top 8 atual e reforcando os pontos da Red Bull.",
  },
];

export const constructors: Constructor[] = [
  {
    position: 1,
    name: "Mercedes",
    slug: "mercedes",
    base: "Brackley, United Kingdom",
    teamPrincipal: "Toto Wolff",
    points: 503,
    wins: 8,
    podiums: 17,
    color: "#27f4d2",
    summary:
      "Lidera o campeonato com Antonelli e Russell somando pontos altos de forma constante.",
  },
  {
    position: 2,
    name: "Ferrari",
    slug: "ferrari",
    base: "Maranello, Italy",
    teamPrincipal: "Frederic Vasseur",
    points: 358,
    wins: 5,
    podiums: 12,
    color: "#e10600",
    summary:
      "Vice-lider nos construtores, sustentada por uma dupla forte em domingos de alta pressao.",
  },
  {
    position: 3,
    name: "McLaren",
    slug: "mclaren",
    base: "Woking, United Kingdom",
    teamPrincipal: "Andrea Stella",
    points: 306,
    wins: 2,
    podiums: 10,
    color: "#ff8700",
    summary:
      "Ainda muito competitiva, com Norris e Piastri mantendo a equipe na briga por podios.",
  },
  {
    position: 4,
    name: "Red Bull Racing",
    slug: "red-bull-racing",
    base: "Milton Keynes, United Kingdom",
    teamPrincipal: "Christian Horner",
    points: 230,
    wins: 1,
    podiums: 6,
    color: "#3671c6",
    summary:
      "Segue no grupo da frente, mas agora perseguindo Mercedes, Ferrari e McLaren no campeonato.",
  },
];

export const upcomingRaces: Race[] = [
  {
    round: 18,
    name: "Singapore GP",
    circuit: "Marina Bay Street Circuit",
    date: "04 Oct",
    country: "Singapore",
    sessions: [
      { date: "02 Oct", label: "Treino livre 1", time: "06:30 BRT", type: "practice" },
      { date: "02 Oct", label: "Treino livre 2", time: "10:00 BRT", type: "practice" },
      { date: "03 Oct", label: "Treino livre 3", time: "06:30 BRT", type: "practice" },
      { date: "03 Oct", label: "Classificacao", time: "10:00 BRT", type: "qualifying" },
      { date: "04 Oct", label: "Corrida", time: "09:00 BRT", type: "race" },
    ],
    status: "next",
  },
  {
    round: 19,
    name: "United States GP",
    circuit: "Circuit of The Americas",
    date: "18 Oct",
    country: "USA",
    sessions: [
      { date: "16 Oct", label: "Treino livre 1", time: "14:30 BRT", type: "practice" },
      { date: "16 Oct", label: "Sprint Qualifying", time: "18:30 BRT", type: "sprint-qualifying" },
      { date: "17 Oct", label: "Sprint", time: "14:00 BRT", type: "sprint" },
      { date: "17 Oct", label: "Classificacao", time: "18:00 BRT", type: "qualifying" },
      { date: "18 Oct", label: "Corrida", time: "16:00 BRT", type: "race" },
    ],
    status: "upcoming",
  },
  {
    round: 20,
    name: "Mexico City GP",
    circuit: "Autodromo Hermanos Rodriguez",
    date: "25 Oct",
    country: "Mexico",
    sessions: [
      { date: "23 Oct", label: "Treino livre 1", time: "15:30 BRT", type: "practice" },
      { date: "23 Oct", label: "Treino livre 2", time: "19:00 BRT", type: "practice" },
      { date: "24 Oct", label: "Treino livre 3", time: "14:30 BRT", type: "practice" },
      { date: "24 Oct", label: "Classificacao", time: "18:00 BRT", type: "qualifying" },
      { date: "25 Oct", label: "Corrida", time: "17:00 BRT", type: "race" },
    ],
    status: "upcoming",
  },
];

export const recentResults: RaceResult[] = [
  {
    round: 17,
    slug: "azerbaijan-gp",
    race: "Azerbaijan GP",
    circuit: "Baku City Circuit",
    country: "Azerbaijan",
    winner: "Oscar Piastri",
    winningTeam: "McLaren",
    fastestLap: "Lando Norris",
    date: "20 Sep",
    summary:
      "Corrida urbana marcada por safety car tardio, boa execucao da McLaren e pressao constante da Ferrari.",
    sessions: [
      {
        type: "race",
        label: "Corrida",
        winner: "Oscar Piastri",
        team: "McLaren",
        second: "Charles Leclerc",
        third: "Max Verstappen",
        note: "Piastri controlou relargadas e converteu ritmo limpo em vitoria.",
      },
      {
        type: "qualifying",
        label: "Classificacao",
        winner: "Charles Leclerc",
        team: "Ferrari",
        second: "Oscar Piastri",
        third: "Max Verstappen",
        note: "Leclerc aproveitou aquecimento rapido dos pneus no setor final.",
      },
    ],
  },
  {
    round: 16,
    slug: "italian-gp",
    race: "Italian GP",
    circuit: "Autodromo Nazionale Monza",
    country: "Italy",
    winner: "Charles Leclerc",
    winningTeam: "Ferrari",
    fastestLap: "Max Verstappen",
    date: "06 Sep",
    summary:
      "Monza teve stint longo decisivo da Ferrari e diferenca pequena entre os quatro primeiros.",
    sessions: [
      {
        type: "race",
        label: "Corrida",
        winner: "Charles Leclerc",
        team: "Ferrari",
        second: "Lando Norris",
        third: "Carlos Sainz",
        note: "Leclerc segurou Norris no ar limpo depois da janela de pit stops.",
      },
      {
        type: "qualifying",
        label: "Classificacao",
        winner: "Max Verstappen",
        team: "Red Bull Racing",
        second: "Charles Leclerc",
        third: "Lando Norris",
        note: "Verstappen fez a pole por margem minima no segundo setor.",
      },
    ],
  },
  {
    round: 15,
    slug: "dutch-gp",
    race: "Dutch GP",
    circuit: "Circuit Zandvoort",
    country: "Netherlands",
    winner: "Max Verstappen",
    winningTeam: "Red Bull Racing",
    fastestLap: "George Russell",
    date: "30 Aug",
    summary:
      "Zandvoort premiou tracao e gestao de pneus, com Verstappen retomando controle no stint final.",
    sessions: [
      {
        type: "race",
        label: "Corrida",
        winner: "Max Verstappen",
        team: "Red Bull Racing",
        second: "George Russell",
        third: "Lando Norris",
        note: "Verstappen abriu vantagem depois da segunda parada.",
      },
      {
        type: "qualifying",
        label: "Classificacao",
        winner: "Lando Norris",
        team: "McLaren",
        second: "Max Verstappen",
        third: "George Russell",
        note: "Norris encontrou volta limpa antes da chuva leve no fim do Q3.",
      },
    ],
  },
  {
    round: 14,
    slug: "belgian-gp",
    race: "Belgian GP",
    circuit: "Circuit de Spa-Francorchamps",
    country: "Belgium",
    winner: "Lewis Hamilton",
    winningTeam: "Mercedes",
    fastestLap: "Lewis Hamilton",
    date: "26 Jul",
    summary:
      "Spa teve variacao de clima e leitura estrategica forte da Mercedes nas janelas de intermediario.",
    sessions: [
      {
        type: "race",
        label: "Corrida",
        winner: "Lewis Hamilton",
        team: "Mercedes",
        second: "Max Verstappen",
        third: "Charles Leclerc",
        note: "Hamilton antecipou a parada certa antes da pista secar.",
      },
      {
        type: "sprint",
        label: "Sprint",
        winner: "Max Verstappen",
        team: "Red Bull Racing",
        second: "Oscar Piastri",
        third: "Lewis Hamilton",
        note: "Verstappen venceu a sprint com ritmo forte de pneu medio.",
      },
      {
        type: "qualifying",
        label: "Classificacao",
        winner: "Charles Leclerc",
        team: "Ferrari",
        second: "Lewis Hamilton",
        third: "Max Verstappen",
        note: "Leclerc acertou o timing da volta em condicao mista.",
      },
    ],
  },
];

export const seasonOptions: SeasonOption[] = [
  {
    year: "2026",
    label: "Temporada demo 2026",
    racesDone: 14,
    racesTotal: 24,
    leader: "Kimi Antonelli",
    leaderPoints: 292,
    runnerUp: "George Russell",
    runnerUpPoints: 211,
    winners: 7,
  },
  {
    year: "2025",
    label: "Snapshot historico 2025",
    racesDone: 24,
    racesTotal: 24,
    leader: "Lando Norris",
    leaderPoints: 421,
    runnerUp: "Charles Leclerc",
    runnerUpPoints: 398,
    winners: 8,
  },
  {
    year: "2024",
    label: "Snapshot historico 2024",
    racesDone: 24,
    racesTotal: 24,
    leader: "Max Verstappen",
    leaderPoints: 575,
    runnerUp: "Charles Leclerc",
    runnerUpPoints: 356,
    winners: 7,
  },
];

export const pointsProgressionBySeason: Record<string, PointsProgression[]> = {
  "2026": [
    {
      driver: "Kimi Antonelli",
      color: "#27f4d2",
      points: [18, 43, 68, 93, 118, 118, 133, 141, 166, 181, 206, 231, 256, 292],
    },
    {
      driver: "George Russell",
      color: "#7de8dc",
      points: [25, 43, 58, 76, 94, 112, 130, 148, 166, 181, 186, 196, 206, 211],
    },
    {
      driver: "Lewis Hamilton",
      color: "#e10600",
      points: [8, 18, 28, 40, 55, 70, 95, 110, 125, 140, 155, 166, 181, 191],
    },
    {
      driver: "Lando Norris",
      color: "#ff8700",
      points: [10, 22, 34, 52, 70, 88, 106, 119, 134, 149, 164, 176, 181, 186],
    },
  ],
  "2025": [
    {
      driver: "Lando Norris",
      color: "#ff8700",
      points: [18, 43, 68, 86, 111, 136, 161, 186, 211, 236, 261, 286, 311, 336, 354, 372, 390, 421],
    },
    {
      driver: "Charles Leclerc",
      color: "#e10600",
      points: [25, 50, 68, 93, 111, 129, 147, 172, 197, 222, 240, 258, 283, 308, 333, 358, 383, 398],
    },
    {
      driver: "Max Verstappen",
      color: "#3671c6",
      points: [15, 33, 58, 83, 108, 133, 151, 169, 194, 219, 244, 269, 287, 305, 330, 355, 373, 389],
    },
    {
      driver: "Lewis Hamilton",
      color: "#27f4d2",
      points: [12, 27, 42, 60, 85, 100, 118, 136, 154, 172, 190, 215, 233, 251, 269, 287, 305, 329],
    },
  ],
  "2024": [
    {
      driver: "Max Verstappen",
      color: "#3671c6",
      points: [25, 51, 77, 102, 127, 152, 177, 202, 227, 252, 277, 302, 327, 352, 377, 402, 427, 452, 477, 502, 527, 552, 575],
    },
    {
      driver: "Charles Leclerc",
      color: "#e10600",
      points: [12, 30, 48, 66, 84, 102, 120, 145, 163, 181, 199, 217, 235, 253, 271, 289, 307, 325, 343, 356],
    },
    {
      driver: "Lando Norris",
      color: "#ff8700",
      points: [8, 20, 32, 50, 68, 86, 104, 122, 147, 172, 197, 215, 233, 251, 269, 287, 305, 323, 341, 349],
    },
    {
      driver: "Carlos Sainz",
      color: "#c40000",
      points: [10, 25, 40, 55, 70, 95, 110, 125, 140, 155, 180, 198, 216, 234, 252, 270, 288, 300],
    },
  ],
};

export const trendLabel: Record<DriverTrend, string> = {
  up: "Subindo",
  down: "Caindo",
  stable: "Estavel",
};

export function getTeams() {
  return Array.from(new Set(drivers.map((driver) => driver.team))).sort();
}

export function getDriverBySlug(slug: string) {
  return drivers.find((driver) => driver.slug === slug);
}

export function getDriversByTeam(team: string) {
  return drivers.filter((driver) => driver.team === team);
}

export function getConstructorBySlug(slug: string) {
  return constructors.find((constructor) => constructor.slug === slug);
}

export function getResultsByTeam(team: string) {
  return recentResults.filter((result) =>
    result.sessions.some((session) => session.team === team),
  );
}

export function getRaceBySlug(slug: string) {
  return recentResults.find((result) => result.slug === slug);
}

export function getSeasonStats() {
  const leader = drivers[0];
  const runnerUp = drivers[1];
  const winners = new Set(drivers.filter((driver) => driver.wins > 0));
  const currentSeason = seasonOptions[0];

  return {
    leader,
    racesDone: currentSeason.racesDone,
    racesTotal: currentSeason.racesTotal,
    driverCount: 20,
    teamCount: 10,
    leaderGap: leader.points - runnerUp.points,
    winnerCount: winners.size,
  };
}
