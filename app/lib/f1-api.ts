import {
  constructors as mockConstructors,
  drivers as mockDrivers,
  recentResults,
  upcomingRaces as mockUpcomingRaces,
  type Constructor,
  type Driver,
  type Race,
} from "../data/f1-data";

const JOLPICA_BASE_URL = "https://api.jolpi.ca/ergast/f1";
const API_REVALIDATE_SECONDS = 60 * 60;

type DataSource = "api" | "mock";

type JolpicaDriverStanding = {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    permanentNumber?: string;
    nationality: string;
  };
  Constructors: Array<{
    name: string;
  }>;
};

type JolpicaConstructorStanding = {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
};

type JolpicaRace = {
  round: string;
  raceName: string;
  date: string;
  Circuit: {
    circuitName: string;
    Location: {
      country: string;
    };
  };
};

type DriverStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        DriverStandings: JolpicaDriverStanding[];
      }>;
    };
  };
};

type ConstructorStandingsResponse = {
  MRData: {
    StandingsTable: {
      StandingsLists: Array<{
        ConstructorStandings: JolpicaConstructorStanding[];
      }>;
    };
  };
};

type RaceScheduleResponse = {
  MRData: {
    RaceTable: {
      Races: JolpicaRace[];
    };
  };
};

export type DashboardData = {
  constructors: Constructor[];
  drivers: Driver[];
  recentResults: typeof recentResults;
  season: string;
  source: DataSource;
  sourceLabel: string;
  stats: {
    driverCount: number;
    leader: Driver;
    leaderGap: number;
    racesDone: number;
    racesTotal: number;
    teamCount: number;
    winnerCount: number;
  };
  upcomingRaces: Race[];
};

async function fetchJolpica<T>(path: string) {
  const response = await fetch(`${JOLPICA_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: API_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Jolpica request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardData(season = "current"): Promise<DashboardData> {
  try {
    const [driverStandings, constructorStandings, schedule] = await Promise.all([
      getDriverStandings(season),
      getConstructorStandings(season),
      getRaceSchedule(season),
    ]);

    const drivers = mergeDrivers(driverStandings);
    const constructors = mergeConstructors(constructorStandings);
    const upcomingRaces = mapUpcomingRaces(schedule);

    return buildDashboardData({
      constructors,
      drivers,
      season,
      source: "api",
      sourceLabel: "Jolpica F1 API",
      upcomingRaces: upcomingRaces.length > 0 ? upcomingRaces : mockUpcomingRaces,
    });
  } catch {
    return buildDashboardData({
      constructors: mockConstructors,
      drivers: mockDrivers,
      season,
      source: "mock",
      sourceLabel: "Dados demo locais",
      upcomingRaces: mockUpcomingRaces,
    });
  }
}

export async function getDriverStandings(season = "current") {
  const data = await fetchJolpica<DriverStandingsResponse>(
    `/${season}/driverstandings.json`,
  );

  return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
}

export async function getConstructorStandings(season = "current") {
  const data = await fetchJolpica<ConstructorStandingsResponse>(
    `/${season}/constructorstandings.json`,
  );

  return (
    data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? []
  );
}

export async function getRaceSchedule(season = "current") {
  const data = await fetchJolpica<RaceScheduleResponse>(`/${season}.json`);

  return data.MRData.RaceTable.Races ?? [];
}

function buildDashboardData({
  constructors,
  drivers,
  season,
  source,
  sourceLabel,
  upcomingRaces,
}: {
  constructors: Constructor[];
  drivers: Driver[];
  season: string;
  source: DataSource;
  sourceLabel: string;
  upcomingRaces: Race[];
}): DashboardData {
  const leader = drivers[0] ?? mockDrivers[0];
  const runnerUp = drivers[1] ?? mockDrivers[1];
  const winners = new Set(drivers.filter((driver) => driver.wins > 0));

  return {
    constructors,
    drivers,
    recentResults,
    season,
    source,
    sourceLabel,
    stats: {
      driverCount: drivers.length,
      leader,
      leaderGap: Math.max(0, leader.points - runnerUp.points),
      racesDone: 17,
      racesTotal: Math.max(24, upcomingRaces.length),
      teamCount: constructors.length,
      winnerCount: winners.size,
    },
    upcomingRaces,
  };
}

function mergeDrivers(standings: JolpicaDriverStanding[]): Driver[] {
  if (standings.length === 0) {
    return mockDrivers;
  }

  return standings.map((standing) => {
    const name = `${standing.Driver.givenName} ${standing.Driver.familyName}`;
    const fallback =
      mockDrivers.find((driver) => normalize(driver.name) === normalize(name)) ??
      mockDrivers.find(
        (driver) =>
          normalize(driver.team) === normalize(standing.Constructors[0]?.name ?? ""),
      );

    return {
      averageFinish: fallback?.averageFinish ?? Number(standing.position),
      country:
        fallback?.country ??
        standing.Driver.nationality.slice(0, 3).toUpperCase(),
      dnfs: fallback?.dnfs ?? 0,
      fastestLaps: fallback?.fastestLaps ?? 0,
      name,
      number: Number(standing.Driver.permanentNumber ?? fallback?.number ?? 0),
      podiums: fallback?.podiums ?? 0,
      points: Number(standing.points),
      position: Number(standing.position),
      qualifyingRank: fallback?.qualifyingRank ?? Number(standing.position),
      slug: standing.Driver.driverId,
      summary:
        fallback?.summary ??
        `${name} aparece em P${standing.position} com ${standing.points} pontos na classificacao atual.`,
      team: standing.Constructors[0]?.name ?? fallback?.team ?? "Sem equipe",
      trend: fallback?.trend ?? "stable",
      wins: Number(standing.wins),
    };
  });
}

function mergeConstructors(
  standings: JolpicaConstructorStanding[],
): Constructor[] {
  if (standings.length === 0) {
    return mockConstructors;
  }

  return standings.map((standing) => {
    const fallback = mockConstructors.find(
      (constructor) =>
        normalize(constructor.name) === normalize(standing.Constructor.name),
    );

    return {
      base: fallback?.base ?? standing.Constructor.nationality,
      color: fallback?.color ?? "#e10600",
      name: standing.Constructor.name,
      podiums: fallback?.podiums ?? 0,
      points: Number(standing.points),
      position: Number(standing.position),
      slug: standing.Constructor.constructorId,
      summary:
        fallback?.summary ??
        `${standing.Constructor.name} soma ${standing.points} pontos na classificacao atual de construtores.`,
      teamPrincipal: fallback?.teamPrincipal ?? "Nao informado",
      wins: Number(standing.wins),
    };
  });
}

function mapUpcomingRaces(races: JolpicaRace[]): Race[] {
  const today = new Date();
  const futureRaces = races
    .filter((race) => new Date(`${race.date}T23:59:59`) >= today)
    .slice(0, 3);

  return futureRaces.map((race, index) => ({
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    date: formatRaceDate(race.date),
    name: race.raceName,
    round: Number(race.round),
    status: index === 0 ? "next" : "upcoming",
  }));
}

function formatRaceDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
