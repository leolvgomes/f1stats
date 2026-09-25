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
};

export type RaceResult = {
  round: number;
  race: string;
  winner: string;
  winningTeam: string;
  fastestLap: string;
  date: string;
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
    name: "Max Verstappen",
    slug: "max-verstappen",
    number: 1,
    team: "Red Bull Racing",
    country: "NED",
    points: 437,
    wins: 11,
    podiums: 16,
    dnfs: 1,
    fastestLaps: 7,
    averageFinish: 2.1,
    qualifyingRank: 1,
    trend: "stable",
    summary:
      "Referencial de ritmo e consistencia, com vantagem forte em vitorias e aproveitamento nos domingos.",
  },
  {
    position: 2,
    name: "Lando Norris",
    slug: "lando-norris",
    number: 4,
    team: "McLaren",
    country: "GBR",
    points: 374,
    wins: 4,
    podiums: 13,
    dnfs: 0,
    fastestLaps: 5,
    averageFinish: 3.4,
    qualifyingRank: 3,
    trend: "up",
    summary:
      "Temporada mais madura, com alta pontuacao recorrente e pressao direta na lideranca.",
  },
  {
    position: 3,
    name: "Charles Leclerc",
    slug: "charles-leclerc",
    number: 16,
    team: "Ferrari",
    country: "MON",
    points: 356,
    wins: 3,
    podiums: 12,
    dnfs: 2,
    fastestLaps: 3,
    averageFinish: 4.0,
    qualifyingRank: 2,
    trend: "up",
    summary:
      "Forte em classificacao e eficiente quando a Ferrari encontra janela de acerto.",
  },
  {
    position: 4,
    name: "Oscar Piastri",
    slug: "oscar-piastri",
    number: 81,
    team: "McLaren",
    country: "AUS",
    points: 292,
    wins: 2,
    podiums: 8,
    dnfs: 1,
    fastestLaps: 2,
    averageFinish: 5.2,
    qualifyingRank: 5,
    trend: "stable",
    summary:
      "Muito consistente, com evolucao limpa em ritmo de corrida e boa conversao de pontos.",
  },
  {
    position: 5,
    name: "Carlos Sainz",
    slug: "carlos-sainz",
    number: 55,
    team: "Ferrari",
    country: "ESP",
    points: 290,
    wins: 2,
    podiums: 9,
    dnfs: 1,
    fastestLaps: 2,
    averageFinish: 5.6,
    qualifyingRank: 6,
    trend: "down",
    summary:
      "Campanha solida, ainda que com oscilacoes recentes em pistas de alta degradacao.",
  },
  {
    position: 6,
    name: "George Russell",
    slug: "george-russell",
    number: 63,
    team: "Mercedes",
    country: "GBR",
    points: 245,
    wins: 2,
    podiums: 4,
    dnfs: 2,
    fastestLaps: 4,
    averageFinish: 6.0,
    qualifyingRank: 4,
    trend: "stable",
    summary:
      "Boa velocidade de uma volta e forte em estrategias que esticam o primeiro stint.",
  },
  {
    position: 7,
    name: "Lewis Hamilton",
    slug: "lewis-hamilton",
    number: 44,
    team: "Mercedes",
    country: "GBR",
    points: 223,
    wins: 2,
    podiums: 5,
    dnfs: 0,
    fastestLaps: 1,
    averageFinish: 6.5,
    qualifyingRank: 7,
    trend: "up",
    summary:
      "Cresceu na segunda metade da temporada, especialmente em ritmo de corrida.",
  },
  {
    position: 8,
    name: "Sergio Perez",
    slug: "sergio-perez",
    number: 11,
    team: "Red Bull Racing",
    country: "MEX",
    points: 152,
    wins: 0,
    podiums: 4,
    dnfs: 3,
    fastestLaps: 1,
    averageFinish: 8.4,
    qualifyingRank: 9,
    trend: "down",
    summary:
      "Pontua bem quando larga no pelotao dianteiro, mas perdeu terreno no duelo interno.",
  },
];

export const constructors: Constructor[] = [
  {
    position: 1,
    name: "McLaren",
    slug: "mclaren",
    base: "Woking, United Kingdom",
    teamPrincipal: "Andrea Stella",
    points: 666,
    wins: 6,
    podiums: 21,
    color: "#ff8700",
    summary:
      "Pacote mais equilibrado do grid, com dois pilotos pontuando alto e excelente eficiencia aerodinamica.",
  },
  {
    position: 2,
    name: "Ferrari",
    slug: "ferrari",
    base: "Maranello, Italy",
    teamPrincipal: "Frederic Vasseur",
    points: 646,
    wins: 5,
    podiums: 21,
    color: "#e10600",
    summary:
      "Forte em pistas de tracao e classificacao, ainda buscando mais estabilidade em degradacao de pneus.",
  },
  {
    position: 3,
    name: "Red Bull Racing",
    slug: "red-bull-racing",
    base: "Milton Keynes, United Kingdom",
    teamPrincipal: "Christian Horner",
    points: 589,
    wins: 11,
    podiums: 20,
    color: "#3671c6",
    summary:
      "Muito competitiva em ritmo puro, com dependencia alta dos pontos do lider do campeonato.",
  },
  {
    position: 4,
    name: "Mercedes",
    slug: "mercedes",
    base: "Brackley, United Kingdom",
    teamPrincipal: "Toto Wolff",
    points: 468,
    wins: 4,
    podiums: 9,
    color: "#27f4d2",
    summary:
      "Evolucao constante ao longo da temporada, com boa leitura estrategica e melhoras em classificacao.",
  },
];

export const upcomingRaces: Race[] = [
  {
    round: 18,
    name: "Singapore GP",
    circuit: "Marina Bay Street Circuit",
    date: "04 Oct",
    country: "Singapore",
    status: "next",
  },
  {
    round: 19,
    name: "United States GP",
    circuit: "Circuit of The Americas",
    date: "18 Oct",
    country: "USA",
    status: "upcoming",
  },
  {
    round: 20,
    name: "Mexico City GP",
    circuit: "Autodromo Hermanos Rodriguez",
    date: "25 Oct",
    country: "Mexico",
    status: "upcoming",
  },
];

export const recentResults: RaceResult[] = [
  {
    round: 17,
    race: "Azerbaijan GP",
    winner: "Oscar Piastri",
    winningTeam: "McLaren",
    fastestLap: "Lando Norris",
    date: "20 Sep",
  },
  {
    round: 16,
    race: "Italian GP",
    winner: "Charles Leclerc",
    winningTeam: "Ferrari",
    fastestLap: "Max Verstappen",
    date: "06 Sep",
  },
  {
    round: 15,
    race: "Dutch GP",
    winner: "Max Verstappen",
    winningTeam: "Red Bull Racing",
    fastestLap: "George Russell",
    date: "30 Aug",
  },
  {
    round: 14,
    race: "Belgian GP",
    winner: "Lewis Hamilton",
    winningTeam: "Mercedes",
    fastestLap: "Lewis Hamilton",
    date: "26 Jul",
  },
];

export const seasonOptions: SeasonOption[] = [
  {
    year: "2026",
    label: "Temporada demo 2026",
    racesDone: 17,
    racesTotal: 24,
    leader: "Max Verstappen",
    leaderPoints: 437,
    runnerUp: "Lando Norris",
    runnerUpPoints: 374,
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
      driver: "Max Verstappen",
      color: "#3671c6",
      points: [25, 43, 68, 93, 118, 143, 168, 193, 218, 243, 268, 293, 318, 343, 368, 402, 437],
    },
    {
      driver: "Lando Norris",
      color: "#ff8700",
      points: [18, 40, 55, 73, 91, 116, 141, 159, 184, 209, 234, 259, 284, 309, 334, 352, 374],
    },
    {
      driver: "Charles Leclerc",
      color: "#e10600",
      points: [15, 30, 52, 70, 88, 106, 131, 156, 181, 199, 224, 249, 274, 299, 324, 349, 356],
    },
    {
      driver: "Oscar Piastri",
      color: "#f5b335",
      points: [10, 22, 34, 52, 70, 88, 106, 124, 149, 174, 192, 210, 228, 246, 264, 282, 292],
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
  return recentResults.filter((result) => result.winningTeam === team);
}

export function getSeasonStats() {
  const leader = drivers[0];
  const runnerUp = drivers[1];
  const winners = new Set(drivers.filter((driver) => driver.wins > 0));

  return {
    leader,
    racesDone: 17,
    racesTotal: 24,
    driverCount: 20,
    teamCount: 10,
    leaderGap: leader.points - runnerUp.points,
    winnerCount: winners.size,
  };
}
