import {
  constructors as mockConstructors,
  drivers as mockDrivers,
  recentResults,
  upcomingRaces as mockUpcomingRaces,
  type CalendarRace,
  type Constructor,
  type Driver,
  type QualifyingClassification,
  type Race,
  type RaceClassification,
  type RaceResult,
  type RaceWeekendSession,
} from "../data/f1-data";
import type { SearchItem } from "./search-types";

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
  time?: string;
  FirstPractice?: JolpicaSessionTime;
  SecondPractice?: JolpicaSessionTime;
  ThirdPractice?: JolpicaSessionTime;
  Qualifying?: JolpicaSessionTime;
  Sprint?: JolpicaSessionTime;
  SprintQualifying?: JolpicaSessionTime;
  SprintShootout?: JolpicaSessionTime;
  Circuit: {
    circuitId?: string;
    circuitName: string;
    Location: {
      country: string;
    };
  };
};

type JolpicaSessionTime = {
  date: string;
  time?: string;
};

type JolpicaResult = {
  Constructor: {
    name: string;
  };
  Driver: {
    driverId: string;
    familyName: string;
    givenName: string;
  };
  FastestLap?: {
    rank: string;
  };
  Time?: {
    time: string;
  };
  grid: string;
  laps: string;
  points: string;
  position: string;
  status: string;
};

type JolpicaQualifyingResult = {
  Constructor: {
    name: string;
  };
  Driver: {
    driverId: string;
    familyName: string;
    givenName: string;
  };
  Q1?: string;
  Q2?: string;
  Q3?: string;
  position: string;
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

type RaceResultsResponse = {
  MRData: {
    RaceTable: {
      Races: Array<
        JolpicaRace & {
          Results?: JolpicaResult[];
        }
      >;
    };
  };
};

type QualifyingResultsResponse = {
  MRData: {
    RaceTable: {
      Races: Array<
        JolpicaRace & {
          QualifyingResults?: JolpicaQualifyingResult[];
        }
      >;
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

export type CalendarData = {
  races: CalendarRace[];
  season: string;
  source: DataSource;
  sourceLabel: string;
};

export type RaceDetailsData = {
  fastestLap?: string;
  qualifyingResults: QualifyingClassification[];
  race: RaceResult;
  raceResults: RaceClassification[];
  scheduleSessions: RaceWeekendSession[];
  source: DataSource;
  sourceLabel: string;
  sprintResults: RaceClassification[];
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

export async function getRaceResults(season: string, round: number) {
  const data = await fetchJolpica<RaceResultsResponse>(
    `/${season}/${round}/results.json`,
  );

  return data.MRData.RaceTable.Races[0];
}

export async function getQualifyingResults(season: string, round: number) {
  const data = await fetchJolpica<QualifyingResultsResponse>(
    `/${season}/${round}/qualifying.json`,
  );

  return data.MRData.RaceTable.Races[0];
}

export async function getSprintResults(season: string, round: number) {
  const data = await fetchJolpica<RaceResultsResponse>(
    `/${season}/${round}/sprint.json`,
  );

  return data.MRData.RaceTable.Races[0];
}

export async function getCalendarData(season = "current"): Promise<CalendarData> {
  try {
    const schedule = await getRaceSchedule(season);
    const races = mapCalendarRaces(schedule);

    return {
      races: races.length > 0 ? races : getMockCalendarRaces(),
      season,
      source: "api",
      sourceLabel: "Jolpica F1 API",
    };
  } catch {
    return {
      races: getMockCalendarRaces(),
      season,
      source: "mock",
      sourceLabel: "Dados demo locais",
    };
  }
}

export async function getRaceDetails(
  slug: string,
  season = "current",
): Promise<RaceDetailsData | null> {
  const fallbackRace = recentResults.find((result) => result.slug === slug);

  try {
    const schedule = await getRaceSchedule(season);
    const scheduledRace =
      schedule.find((race) => slugify(race.raceName) === slug) ??
      schedule.find((race) => Number(race.round) === fallbackRace?.round);

    if (!scheduledRace && !fallbackRace) {
      return null;
    }

    const round = Number(scheduledRace?.round ?? fallbackRace?.round);
    const [raceResponse, qualifyingResponse, sprintResponse] = await Promise.all([
      getRaceResults(season, round).catch(() => undefined),
      getQualifyingResults(season, round).catch(() => undefined),
      getSprintResults(season, round).catch(() => undefined),
    ]);

    const raceResults = mapRaceClassification(raceResponse?.Results ?? []);
    const qualifyingResults = mapQualifyingClassification(
      qualifyingResponse?.QualifyingResults ?? [],
    );
    const sprintResults = mapRaceClassification(sprintResponse?.Results ?? []);
    const winner = raceResults[0];
    const pole = qualifyingResults[0];
    const sprintWinner = sprintResults[0];
    const fastestLapResult = raceResponse?.Results?.find(
      (result) => result.FastestLap?.rank === "1",
    );
    const fastestLap =
      fastestLapResult ? formatDriverName(fastestLapResult.Driver) : fallbackRace?.fastestLap;
    const generatedSessions: RaceResult["sessions"] = [
      winner
        ? {
            label: "Corrida",
            note: `${winner.driver} terminou na frente depois de largar em P${winner.grid ?? "?"}.`,
            second: raceResults[1]?.driver ?? "Nao informado",
            team: winner.team,
            third: raceResults[2]?.driver ?? "Nao informado",
            type: "race",
            winner: winner.driver,
          }
        : undefined,
      sprintWinner
        ? {
            label: "Sprint",
            note: `${sprintWinner.driver} liderou a classificacao curta do fim de semana.`,
            second: sprintResults[1]?.driver ?? "Nao informado",
            team: sprintWinner.team,
            third: sprintResults[2]?.driver ?? "Nao informado",
            type: "sprint",
            winner: sprintWinner.driver,
          }
        : undefined,
      pole
        ? {
            label: "Classificacao",
            note: `${pole.driver} ficou com a melhor posicao de largada registrada pela API.`,
            second: qualifyingResults[1]?.driver ?? "Nao informado",
            team: pole.team,
            third: qualifyingResults[2]?.driver ?? "Nao informado",
            type: "qualifying",
            winner: pole.driver,
          }
        : undefined,
    ].filter((session): session is RaceResult["sessions"][number] =>
      Boolean(session),
    );

    const race: RaceResult = {
      circuit:
        scheduledRace?.Circuit.circuitName ?? fallbackRace?.circuit ?? "Circuito",
      country:
        scheduledRace?.Circuit.Location.country ?? fallbackRace?.country ?? "Pais",
      date: scheduledRace ? formatRaceDate(scheduledRace.date) : fallbackRace?.date ?? "",
      fastestLap: fastestLap ?? "Nao informado",
      race: scheduledRace?.raceName ?? fallbackRace?.race ?? "Grande Premio",
      round,
      slug: slugify(scheduledRace?.raceName ?? fallbackRace?.race ?? slug),
      summary:
        fallbackRace?.summary ??
        `Resumo gerado com classificacoes oficiais disponiveis para a etapa ${round}.`,
      sessions: generatedSessions.length ? generatedSessions : (fallbackRace?.sessions ?? []),
      winner: winner?.driver ?? fallbackRace?.winner ?? "Nao informado",
      winningTeam: winner?.team ?? fallbackRace?.winningTeam ?? "Nao informado",
    };

    return {
      fastestLap,
      qualifyingResults,
      race,
      raceResults,
      scheduleSessions: scheduledRace ? mapWeekendSessions(scheduledRace) : [],
      source: "api",
      sourceLabel: "Jolpica F1 API",
      sprintResults,
    };
  } catch {
    return fallbackRace ? buildMockRaceDetails(fallbackRace) : null;
  }
}

export async function getSearchData(season = "current") {
  const [dashboard, calendar] = await Promise.all([
    getDashboardData(season),
    getCalendarData(season),
  ]);

  const driverItems: SearchItem[] = dashboard.drivers.map((driver) => ({
    description: `${driver.team} / #${driver.number} / ${driver.country}`,
    href: `/pilotos/${driver.slug}`,
    meta: `${driver.points} pts / P${driver.position}`,
    title: driver.name,
    type: "driver",
  }));
  const teamItems: SearchItem[] = dashboard.constructors.map((constructor) => ({
    description: `${constructor.base} / ${constructor.teamPrincipal}`,
    href: `/equipes/${constructor.slug}`,
    meta: `${constructor.points} pts / P${constructor.position}`,
    title: constructor.name,
    type: "team",
  }));
  const raceItems: SearchItem[] = recentResults.map((race) => ({
    description: `${race.circuit} / ${race.country}`,
    href: `/corridas/${race.slug}`,
    meta: `R${race.round} / vencedor: ${race.winner}`,
    title: race.race,
    type: "race",
  }));
  const calendarItems: SearchItem[] = calendar.races.map((race) => ({
    description: `${race.circuit} / ${race.country}`,
    href: race.slug ? `/corridas/${race.slug}` : "/calendario",
    meta: `R${race.round} / ${race.date} / ${race.status}`,
    title: race.name,
    type: "calendar",
  }));

  return {
    items: [...driverItems, ...teamItems, ...raceItems, ...calendarItems],
    source: dashboard.source === "api" || calendar.source === "api" ? "api" : "mock",
    sourceLabel:
      dashboard.source === "api" || calendar.source === "api"
        ? "Jolpica F1 API"
        : "Dados demo locais",
  };
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
    sessions: mapWeekendSessions(race),
    status: index === 0 ? "next" : "upcoming",
  }));
}

function mapCalendarRaces(races: JolpicaRace[]): CalendarRace[] {
  const today = new Date();
  let nextRaceFound = false;

  return races.map((race) => {
    const isFuture = new Date(`${race.date}T23:59:59`) >= today;
    const status = !isFuture
      ? "completed"
      : nextRaceFound
        ? "upcoming"
        : "next";

    if (isFuture && !nextRaceFound) {
      nextRaceFound = true;
    }

    return {
      circuit: race.Circuit.circuitName,
      country: race.Circuit.Location.country,
      date: formatRaceDate(race.date),
      name: race.raceName,
      round: Number(race.round),
      sessions: mapWeekendSessions(race),
      slug: slugify(race.raceName),
      status,
    };
  });
}

function getMockCalendarRaces(): CalendarRace[] {
  const completedRaces = recentResults.map((result) => ({
    circuit: result.circuit,
    country: result.country,
    date: result.date,
    name: result.race,
    round: result.round,
    slug: result.slug,
    status: "completed" as const,
  }));
  const upcoming = mockUpcomingRaces.map((race) => ({
    ...race,
    sessions: race.sessions ?? [],
    status: race.status,
  }));

  return [...completedRaces, ...upcoming].sort(
    (first, second) => first.round - second.round,
  );
}

function buildMockRaceDetails(race: RaceResult): RaceDetailsData {
  return {
    fastestLap: race.fastestLap,
    qualifyingResults: [],
    race,
    raceResults: race.sessions
      .filter((session) => session.type === "race")
      .flatMap((session) =>
        [session.winner, session.second, session.third].map((driver, index) => ({
          driver,
          position: index + 1,
          team: index === 0 ? session.team : findDriverTeam(driver),
        })),
      ),
    scheduleSessions: [],
    source: "mock",
    sourceLabel: "Dados demo locais",
    sprintResults: race.sessions
      .filter((session) => session.type === "sprint")
      .flatMap((session) =>
        [session.winner, session.second, session.third].map((driver, index) => ({
          driver,
          position: index + 1,
          team: index === 0 ? session.team : findDriverTeam(driver),
        })),
      ),
  };
}

function mapWeekendSessions(race: JolpicaRace): RaceWeekendSession[] {
  return [
    mapSessionTime("Treino livre 1", "practice", race.FirstPractice),
    mapSessionTime("Treino livre 2", "practice", race.SecondPractice),
    mapSessionTime("Treino livre 3", "practice", race.ThirdPractice),
    mapSessionTime(
      "Sprint Qualifying",
      "sprint-qualifying",
      race.SprintQualifying ?? race.SprintShootout,
    ),
    mapSessionTime("Sprint", "sprint", race.Sprint),
    mapSessionTime("Classificacao", "qualifying", race.Qualifying),
    mapSessionTime("Corrida", "race", {
      date: race.date,
      time: race.time,
    }),
  ].filter((session): session is RaceWeekendSession => Boolean(session));
}

function mapSessionTime(
  label: string,
  type: RaceWeekendSession["type"],
  session?: JolpicaSessionTime,
): RaceWeekendSession | undefined {
  if (!session) {
    return undefined;
  }

  return {
    date: formatRaceDate(session.date),
    label,
    time: session.time ? formatSessionTime(session.date, session.time) : undefined,
    type,
  };
}

function mapRaceClassification(results: JolpicaResult[]): RaceClassification[] {
  return results.map((result) => ({
    driver: formatDriverName(result.Driver),
    grid: Number(result.grid),
    laps: Number(result.laps),
    points: Number(result.points),
    position: Number(result.position),
    status: result.status,
    team: result.Constructor.name,
    time: result.Time?.time,
  }));
}

function mapQualifyingClassification(
  results: JolpicaQualifyingResult[],
): QualifyingClassification[] {
  return results.map((result) => ({
    driver: formatDriverName(result.Driver),
    position: Number(result.position),
    q1: result.Q1,
    q2: result.Q2,
    q3: result.Q3,
    team: result.Constructor.name,
  }));
}

function formatRaceDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatSessionTime(date: string, time: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(`${date}T${time}`));
}

function formatDriverName(driver: JolpicaResult["Driver"]) {
  return `${driver.givenName} ${driver.familyName}`;
}

function findDriverTeam(driverName: string) {
  return (
    mockDrivers.find((driver) => driver.name === driverName)?.team ??
    "Nao informado"
  );
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/grand prix/g, "gp")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
