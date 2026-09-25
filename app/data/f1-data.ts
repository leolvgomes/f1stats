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
  points: number;
  wins: number;
  podiums: number;
  color: string;
};

export type Race = {
  round: number;
  name: string;
  circuit: string;
  date: string;
  country: string;
  status: "next" | "upcoming";
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
    points: 666,
    wins: 6,
    podiums: 21,
    color: "#ff8700",
  },
  {
    position: 2,
    name: "Ferrari",
    points: 646,
    wins: 5,
    podiums: 21,
    color: "#e10600",
  },
  {
    position: 3,
    name: "Red Bull Racing",
    points: 589,
    wins: 11,
    podiums: 20,
    color: "#3671c6",
  },
  {
    position: 4,
    name: "Mercedes",
    points: 468,
    wins: 4,
    podiums: 9,
    color: "#27f4d2",
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
