import {
  constructors as mockConstructors,
  drivers as mockDrivers,
  recentResults,
  seasonOptions,
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

const OPENF1_BASE_URL = "https://api.openf1.org/v1";
const API_REVALIDATE_SECONDS = 60 * 60;

type DataSource = "api" | "mock";

type OpenF1Meeting = {
  circuit_short_name: string;
  country_name: string;
  date_end: string;
  date_start: string;
  location: string;
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  year: number;
};

type OpenF1Session = {
  circuit_short_name: string;
  country_name: string;
  date_end: string;
  date_start: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
};

type OpenF1Driver = {
  driver_number: number;
  full_name: string;
  name_acronym?: string;
  team_name: string;
};

type OpenF1SessionResult = {
  dnf?: boolean;
  dns?: boolean;
  dsq?: boolean;
  driver_number: number;
  duration?: number | number[];
  gap_to_leader?: number | string | Array<number | string | null> | null;
  number_of_laps?: number;
  position: number;
  session_key: number;
};

type OpenF1StartingGrid = {
  driver_number: number;
  position: number;
  session_key: number;
};

type OpenF1DriverStanding = {
  driver_number: number;
  points_current: number;
  points_start: number;
  position_current: number;
  position_start: number;
};

type OpenF1TeamStanding = {
  points_current: number;
  position_current: number;
  position_start: number;
  team_name: string;
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

async function fetchOpenF1<T>(path: string) {
  const response = await fetch(`${OPENF1_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: API_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`OpenF1 request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getDashboardData(season = "current"): Promise<DashboardData> {
  try {
    const resolvedSeason = resolveSeason(season);
    const meetings = await getMeetings(resolvedSeason);
    const latestRaceSession = await getLatestRaceSession(resolvedSeason);
    const [drivers, constructors] = latestRaceSession
      ? await Promise.all([
          getDriverStandings(season, latestRaceSession.session_key),
          getConstructorStandings(season, latestRaceSession.session_key),
        ])
      : [mockDrivers, mockConstructors];

    return buildDashboardData({
      constructors: constructors.length ? constructors : mockConstructors,
      drivers: drivers.length ? drivers : mockDrivers,
      season: resolvedSeason.toString(),
      source: "api",
      sourceLabel: "OpenF1 API",
      upcomingRaces: mapUpcomingRaces(meetings),
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

export async function getDriverStandings(
  season = "current",
  sessionKey?: number,
) {
  const latestRaceSession = sessionKey
    ? undefined
    : await getLatestRaceSession(resolveSeason(season));
  const standingsSessionKey = sessionKey ?? latestRaceSession?.session_key;

  if (!standingsSessionKey) {
    return mockDrivers;
  }

  const [standings, drivers] = await Promise.all([
    fetchOpenF1<OpenF1DriverStanding[]>(
      `/championship_drivers?session_key=${standingsSessionKey}`,
    ),
    getDriversForSession(standingsSessionKey),
  ]);

  if (standings.length === 0) {
    return mockDrivers;
  }

  return standings
    .sort((first, second) => first.position_current - second.position_current)
    .map((standing) => mapDriverStanding(standing, drivers));
}

export async function getConstructorStandings(
  season = "current",
  sessionKey?: number,
) {
  const latestRaceSession = sessionKey
    ? undefined
    : await getLatestRaceSession(resolveSeason(season));
  const standingsSessionKey = sessionKey ?? latestRaceSession?.session_key;

  if (!standingsSessionKey) {
    return mockConstructors;
  }

  const standings = await fetchOpenF1<OpenF1TeamStanding[]>(
    `/championship_teams?session_key=${standingsSessionKey}`,
  );

  if (standings.length === 0) {
    return mockConstructors;
  }

  return standings
    .sort((first, second) => first.position_current - second.position_current)
    .map(mapConstructorStanding);
}

export async function getRaceSchedule(season = "current") {
  return getMeetings(resolveSeason(season));
}

export async function getCalendarData(season = "current"): Promise<CalendarData> {
  try {
    const resolvedSeason = resolveSeason(season);
    const [meetings, sessionsByMeeting] = await Promise.all([
      getMeetings(resolvedSeason),
      getSessionsByMeeting(resolvedSeason),
    ]);

    return {
      races: mapCalendarRaces(meetings, sessionsByMeeting),
      season: resolvedSeason.toString(),
      source: "api",
      sourceLabel: "OpenF1 API",
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
    const resolvedSeason = resolveSeason(season);
    const [meetings, sessionsByMeeting] = await Promise.all([
      getMeetings(resolvedSeason),
      getSessionsByMeeting(resolvedSeason),
    ]);
    const meeting = findMeetingBySlug(meetings, slug, fallbackRace);

    if (!meeting) {
      return fallbackRace ? buildMockRaceDetails(fallbackRace) : null;
    }

    const sessions = sessionsByMeeting.get(meeting.meeting_key) ?? [];
    const raceSession = findSession(sessions, "Race");
    const qualifyingSession = findSession(sessions, "Qualifying");
    const sprintSession = findSession(sessions, "Sprint");
    const [drivers, raceResults, qualifyingResults, sprintResults, grid] =
      await Promise.all([
        raceSession ? getDriversForSession(raceSession.session_key) : new Map(),
        raceSession ? getSessionResult(raceSession.session_key).catch(() => []) : [],
        qualifyingSession
          ? getSessionResult(qualifyingSession.session_key).catch(() => [])
          : [],
        sprintSession ? getSessionResult(sprintSession.session_key).catch(() => []) : [],
        raceSession ? getStartingGrid(raceSession.session_key).catch(() => []) : [],
      ]);
    const gridByDriver = new Map(
      grid.map((entry) => [entry.driver_number, entry.position]),
    );
    const mappedRaceResults = mapOpenF1Classification(
      raceResults,
      drivers,
      gridByDriver,
    );
    const mappedQualifyingResults = mapOpenF1Qualifying(
      qualifyingResults,
      drivers,
    );
    const mappedSprintResults = mapOpenF1Classification(sprintResults, drivers);
    const winner = mappedRaceResults[0];
    const pole = mappedQualifyingResults[0];
    const sprintWinner = mappedSprintResults[0];
    const race = buildRaceResult({
      fallbackRace,
      meeting,
      meetings,
      pole,
      raceResults: mappedRaceResults,
      sprintWinner,
      winner,
    });

    return {
      fastestLap: race.fastestLap,
      qualifyingResults: mappedQualifyingResults,
      race,
      raceResults: mappedRaceResults.length
        ? mappedRaceResults
        : buildMockRaceDetails(fallbackRace ?? race).raceResults,
      scheduleSessions: mapWeekendSessions(sessions),
      source: "api",
      sourceLabel: "OpenF1 API",
      sprintResults: mappedSprintResults,
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
        ? "OpenF1 API"
        : "Dados demo locais",
  };
}

async function getMeetings(season: number) {
  return fetchOpenF1<OpenF1Meeting[]>(`/meetings?year=${season}`);
}

async function getSessions(season: number) {
  return fetchOpenF1<OpenF1Session[]>(`/sessions?year=${season}`);
}

async function getSessionResult(sessionKey: number) {
  return fetchOpenF1<OpenF1SessionResult[]>(
    `/session_result?session_key=${sessionKey}`,
  );
}

async function getStartingGrid(sessionKey: number) {
  return fetchOpenF1<OpenF1StartingGrid[]>(
    `/starting_grid?session_key=${sessionKey}`,
  );
}

async function getSessionsByMeeting(season: number) {
  const sessions = await getSessions(season);
  const sessionsByMeeting = new Map<number, OpenF1Session[]>();

  sessions.forEach((session) => {
    sessionsByMeeting.set(session.meeting_key, [
      ...(sessionsByMeeting.get(session.meeting_key) ?? []),
      session,
    ]);
  });

  return sessionsByMeeting;
}

async function getLatestRaceSession(season: number) {
  const sessions = await getSessions(season);

  return sessions
    .filter((session) => session.session_type === "Race")
    .filter((session) => new Date(session.date_start).getTime() <= Date.now())
    .sort(
      (first, second) =>
        new Date(second.date_start).getTime() -
        new Date(first.date_start).getTime(),
    )[0];
}

async function getDriversForSession(sessionKey: number) {
  const drivers = await fetchOpenF1<OpenF1Driver[]>(
    `/drivers?session_key=${sessionKey}`,
  );

  return new Map(drivers.map((driver) => [driver.driver_number, driver]));
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
  const seasonYear = season === "current" ? new Date().getFullYear().toString() : season;
  const seasonSummary = seasonOptions.find((option) => option.year === seasonYear);

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
      racesDone: seasonSummary?.racesDone ?? 0,
      racesTotal: seasonSummary?.racesTotal ?? Math.max(24, upcomingRaces.length),
      teamCount: constructors.length,
      winnerCount: winners.size,
    },
    upcomingRaces,
  };
}

function mapDriverStanding(
  standing: OpenF1DriverStanding,
  drivers: Map<number, OpenF1Driver>,
): Driver {
  const openDriver = drivers.get(standing.driver_number);
  const name = openDriver ? toTitleName(openDriver.full_name) : `#${standing.driver_number}`;
  const fallback =
    mockDrivers.find((driver) => normalize(driver.name) === normalize(name)) ??
    mockDrivers.find((driver) => driver.number === standing.driver_number);

  return {
    averageFinish: fallback?.averageFinish ?? standing.position_current,
    country: fallback?.country ?? openDriver?.name_acronym ?? "F1",
    dnfs: fallback?.dnfs ?? 0,
    fastestLaps: fallback?.fastestLaps ?? 0,
    name,
    number: standing.driver_number,
    podiums: fallback?.podiums ?? 0,
    points: standing.points_current,
    position: standing.position_current,
    qualifyingRank: fallback?.qualifyingRank ?? standing.position_current,
    slug: fallback?.slug ?? slugify(name),
    summary:
      fallback?.summary ??
      `${name} aparece em P${standing.position_current} com ${standing.points_current} pontos segundo a OpenF1.`,
    team: openDriver?.team_name ?? fallback?.team ?? "Nao informado",
    trend:
      standing.position_current < standing.position_start
        ? "up"
        : standing.position_current > standing.position_start
          ? "down"
          : "stable",
    wins: fallback?.wins ?? 0,
  };
}

function mapConstructorStanding(standing: OpenF1TeamStanding): Constructor {
  const fallback = mockConstructors.find(
    (constructor) => normalize(constructor.name) === normalize(standing.team_name),
  );

  return {
    base: fallback?.base ?? "Nao informado",
    color: fallback?.color ?? "#e10600",
    name: standing.team_name,
    podiums: fallback?.podiums ?? 0,
    points: standing.points_current,
    position: standing.position_current,
    slug: fallback?.slug ?? slugify(standing.team_name),
    summary:
      fallback?.summary ??
      `${standing.team_name} aparece em P${standing.position_current} com ${standing.points_current} pontos segundo a OpenF1.`,
    teamPrincipal: fallback?.teamPrincipal ?? "Nao informado",
    wins: fallback?.wins ?? 0,
  };
}

function mapUpcomingRaces(meetings: OpenF1Meeting[]): Race[] {
  return meetings
    .filter((meeting) => new Date(meeting.date_end).getTime() >= Date.now())
    .slice(0, 3)
    .map((meeting, index) => ({
      circuit: meeting.circuit_short_name,
      country: meeting.country_name,
      date: formatRaceDate(meeting.date_start),
      name: meeting.meeting_name,
      round: getRound(meetings, meeting),
      status: index === 0 ? "next" : "upcoming",
    }));
}

function mapCalendarRaces(
  meetings: OpenF1Meeting[],
  sessionsByMeeting: Map<number, OpenF1Session[]>,
): CalendarRace[] {
  let nextRaceFound = false;

  return meetings.map((meeting) => {
    const isFuture = new Date(meeting.date_end).getTime() >= Date.now();
    const status = !isFuture
      ? "completed"
      : nextRaceFound
        ? "upcoming"
        : "next";

    if (isFuture && !nextRaceFound) {
      nextRaceFound = true;
    }

    return {
      circuit: meeting.circuit_short_name,
      country: meeting.country_name,
      date: formatRaceDate(meeting.date_start),
      name: meeting.meeting_name,
      round: getRound(meetings, meeting),
      sessions: mapWeekendSessions(
        sessionsByMeeting.get(meeting.meeting_key) ?? [],
      ),
      slug: slugify(meeting.meeting_name),
      status,
    };
  });
}

function buildRaceResult({
  fallbackRace,
  meeting,
  meetings,
  pole,
  raceResults,
  sprintWinner,
  winner,
}: {
  fallbackRace?: RaceResult;
  meeting: OpenF1Meeting;
  meetings: OpenF1Meeting[];
  pole?: QualifyingClassification;
  raceResults: RaceClassification[];
  sprintWinner?: RaceClassification;
  winner?: RaceClassification;
}): RaceResult {
  const generatedSessions: RaceResult["sessions"] = [
    winner
      ? {
          label: "Corrida",
          note: `${winner.driver} venceu a corrida registrada pela OpenF1.`,
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
          note: `${sprintWinner.driver} liderou a sprint registrada pela OpenF1.`,
          second: "Nao informado",
          team: sprintWinner.team,
          third: "Nao informado",
          type: "sprint",
          winner: sprintWinner.driver,
        }
      : undefined,
    pole
      ? {
          label: "Classificacao",
          note: `${pole.driver} fechou a classificacao em P1 segundo a OpenF1.`,
          second: "Nao informado",
          team: pole.team,
          third: "Nao informado",
          type: "qualifying",
          winner: pole.driver,
        }
      : undefined,
  ].filter((session): session is RaceResult["sessions"][number] =>
    Boolean(session),
  );

  return {
    circuit: meeting.circuit_short_name,
    country: meeting.country_name,
    date: formatRaceDate(meeting.date_start),
    fastestLap: fallbackRace?.fastestLap ?? "Nao informado",
    race: meeting.meeting_name,
    round: getRound(meetings, meeting),
    slug: slugify(meeting.meeting_name),
    summary:
      fallbackRace?.summary ??
      `${meeting.meeting_name} com sessoes e resultados consumidos da OpenF1.`,
    sessions: generatedSessions.length ? generatedSessions : (fallbackRace?.sessions ?? []),
    winner: winner?.driver ?? fallbackRace?.winner ?? "Nao informado",
    winningTeam: winner?.team ?? fallbackRace?.winningTeam ?? "Nao informado",
  };
}

function mapOpenF1Classification(
  results: OpenF1SessionResult[],
  drivers: Map<number, OpenF1Driver>,
  gridByDriver = new Map<number, number>(),
): RaceClassification[] {
  return results
    .sort((first, second) => first.position - second.position)
    .map((result) => {
      const driver = drivers.get(result.driver_number);

      return {
        driver: driver ? toTitleName(driver.full_name) : `#${result.driver_number}`,
        grid: gridByDriver.get(result.driver_number),
        laps: result.number_of_laps,
        position: result.position,
        status: getResultStatus(result),
        team: driver?.team_name ?? findDriverTeamByNumber(result.driver_number),
        time: formatDuration(result.duration),
      };
    });
}

function mapOpenF1Qualifying(
  results: OpenF1SessionResult[],
  drivers: Map<number, OpenF1Driver>,
): QualifyingClassification[] {
  return results
    .sort((first, second) => first.position - second.position)
    .map((result) => {
      const driver = drivers.get(result.driver_number);
      const durations = Array.isArray(result.duration) ? result.duration : [];

      return {
        driver: driver ? toTitleName(driver.full_name) : `#${result.driver_number}`,
        position: result.position,
        q1: formatDuration(durations[0]),
        q2: formatDuration(durations[1]),
        q3: formatDuration(durations[2]),
        team: driver?.team_name ?? findDriverTeamByNumber(result.driver_number),
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

function mapWeekendSessions(sessions: OpenF1Session[]): RaceWeekendSession[] {
  return [...sessions]
    .sort(
      (first, second) =>
        new Date(first.date_start).getTime() -
        new Date(second.date_start).getTime(),
    )
    .map((session) => ({
      date: formatRaceDate(session.date_start),
      label: translateSessionName(session.session_name),
      time: formatSessionTime(session.date_start),
      type: toSessionType(session.session_type),
    }));
}

function findMeetingBySlug(
  meetings: OpenF1Meeting[],
  slug: string,
  fallbackRace?: RaceResult,
) {
  return (
    meetings.find((meeting) => slugify(meeting.meeting_name) === slug) ??
    meetings.find((meeting) => slugify(meeting.country_name) === slug) ??
    meetings.find(
      (meeting) =>
        normalize(meeting.country_name) === normalize(fallbackRace?.country ?? ""),
    )
  );
}

function getRound(meetings: OpenF1Meeting[], meeting: OpenF1Meeting) {
  return (
    [...meetings]
      .sort(
        (first, second) =>
          new Date(first.date_start).getTime() -
          new Date(second.date_start).getTime(),
      )
      .findIndex((item) => item.meeting_key === meeting.meeting_key) + 1
  );
}

function findSession(sessions: OpenF1Session[], sessionType: string) {
  return sessions.find((session) => session.session_type === sessionType);
}

function resolveSeason(season: string) {
  return season === "current" ? new Date().getFullYear() : Number(season);
}

function toSessionType(sessionType: string): RaceWeekendSession["type"] {
  if (sessionType === "Race") {
    return "race";
  }

  if (sessionType === "Sprint") {
    return "sprint";
  }

  if (sessionType === "Sprint Qualifying") {
    return "sprint-qualifying";
  }

  if (sessionType === "Qualifying") {
    return "qualifying";
  }

  return "practice";
}

function translateSessionName(sessionName: string) {
  return sessionName
    .replace("Practice", "Treino livre")
    .replace("Qualifying", "Classificacao")
    .replace("Race", "Corrida");
}

function formatRaceDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function formatSessionTime(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

function formatDuration(duration?: number | number[]) {
  if (Array.isArray(duration) || typeof duration !== "number") {
    return undefined;
  }

  const minutes = Math.floor(duration / 60);
  const seconds = duration - minutes * 60;

  return minutes === 0
    ? seconds.toFixed(3)
    : `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

function getResultStatus(result: OpenF1SessionResult) {
  if (result.dsq) {
    return "DSQ";
  }

  if (result.dns) {
    return "DNS";
  }

  if (result.dnf) {
    return "DNF";
  }

  return typeof result.gap_to_leader === "string"
    ? result.gap_to_leader
    : undefined;
}

function toTitleName(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
    .join(" ");
}

function findDriverTeam(driverName: string) {
  return (
    mockDrivers.find((driver) => driver.name === driverName)?.team ??
    "Nao informado"
  );
}

function findDriverTeamByNumber(driverNumber: number) {
  return (
    mockDrivers.find((driver) => driver.number === driverNumber)?.team ??
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
