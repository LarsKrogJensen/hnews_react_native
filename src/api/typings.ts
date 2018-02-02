export interface Path {
    id: number;
    name: string;
    englishName: string;
    termKey: string;
}

export interface ShirtColors {
    shirtColor1: string;
    shirtColor2: string;
}


export interface TeamColors {
    home: ShirtColors;
    away: ShirtColors;
}

export interface Stream {
    channelId: number;
}

export interface Event {
    id: number;
    name: string;
    homeName: string;
    awayName: string;
    start: string;
    group: string;
    type: string;
    nonLiveBoCount: number;
    liveBetOffers: boolean;
    openForLiveBetting: boolean;
    boUri: string;
    groupId: number;
    hideStartNo: boolean;
    sport: string;
    path: Path[];
    englishName: string;
    liveBoCount: number;
    state: string;
    displayType: string;
    hasPrematchStatistics: boolean;
    teamColors: TeamColors;
    streamed?: boolean;
    streams: Stream[];
    participants?: Participant[];
    distance?: string;
    eventNumber?: number;
    editorial?: string;
    originalStartTime?: string;
    raceType?: string;
    trackType?: string;
    raceClass?: string;
    going?: string;
}


export interface Participant {
    participanyId: number;
    name: string;
    scratched?: boolean;
    nonRunner?: boolean;
    startNumber?: 9;
    extended?: ExtendedInfo
}

export interface ExtendedInfo {
    startNumber: number,
    driverName: string,
    age: string,
    weight: string
    editorial: string,
    hasIcon: boolean,
    trainerName: string
    formFigures: FormFigures[]
}

export interface FormFigures {
    type: string,
    figures: string
}

export interface MatchClock {
    minute: number;
    second: number;
    period: string;
    running: boolean;
    disabled?: boolean;
}

export interface Score {
    home: string;
    away: string;
    info: string;
    who: string;
}

export interface FootballStat {
    yellowCards: number;
    redCards: number;
    corners: number;
}


export interface FootballStats {
    home: FootballStat;
    away: FootballStat;
}

export interface SetStats {
    home: number[];
    away: number[];
    homeServe: boolean;
}

export interface EventStats {
    football: FootballStats;
    sets: SetStats;
}

export interface LiveStatistic {
    occurrenceTypeId: string;
    count: number;
}

export interface LiveData {
    eventId: number;
    matchClock?: MatchClock;
    score: Score;
    open: boolean;
    visualizationSupported: boolean;
    statistics: EventStats;
    liveStatistics: LiveStatistic[];
}

export interface Criterion {
    id: number;
    label: string;
    englishLabel: string;
    order?: number[];
}

export interface BetOfferType {
    id: number;
    name: string;
    englishName: string;
}

export interface Pba {
    disabled: boolean;
    status: string;
}

export interface OutcomeCriterion {
    type: number
    name: string
}

export interface Outcome {
    id: number;
    label: string;
    englishLabel: string;
    odds: number;
    type: string;
    betOfferId: number;
    changedDate: Date;
    oddsFractional: string;
    oddsAmerican: string;
    status: string;
    participant: string;
    participantId?: number;
    line?: number
    homeTeamMember: boolean
    criterion?: OutcomeCriterion
}

export interface OddsStats {
    unexpectedOddsTrend: boolean;
    outcomeId: any;
    startingOdds: number;
    startingOddsFractional: string;
    startingOddsAmerican: string;
}

export interface BetOffer {
    id: number;
    live: boolean;
    criterion: Criterion;
    betOfferType: BetOfferType;
    eventId: number;
    pba: Pba;
    cashIn: boolean;
    outcomes: Outcome[];
    main: boolean;
    prematch: boolean;
    cashOutStatus: string;
    oddsStats: OddsStats;
    categoryName: string;
    suspended?: boolean;
    open?: boolean;
    extra: string;
    startingPrice?: boolean;
}

export interface LiveEvent {
    event: Event;
    liveData: LiveData;
    mainBetOffer?: BetOffer;
}

export interface RootGroup {
    group: EventGroup
}

export interface BetOfferCategories {
    categories: BetOfferCategory[]
}

export interface BetOfferCategory {
    id: number
    name: string
    isDefault: boolean
    sortOrder: number
    boCount: number;
    displayBoTypeHeaders: boolean
    sport: string
    mappings: BetOfferCategoryMapping[]
}

export interface BetOfferCategoryMapping {
    criterionId: number
    boType: number;
    sortOrder: number
}


export interface EventGroup {
    id: number;
    name: string;
    englishName: string;
    groups?: EventGroup[];
    sortOrder: string;
    sport: string;
    termKey: string;
    boCount?: number
    eventCount?: number
    secondsToNextEvent?: number
    pathTermId?: string
    parentGroup?: EventGroup
}

export interface LiveEvents {
    liveEvents: LiveEvent[];
    group: EventGroup;
}

export interface EventWithBetOffers {
    event: Event,
    betOffers?: BetOffer[],
    liveData?: LiveData
}

export interface Range {
    start?: number;
    size?: number;
    total?: number;
}

export interface LeagueTable {
    eventGroupId: number,
    updated: string,
    leagueTableRows: LeagueTableRow[]
}

export interface LeagueTableRow {
    position: number
    participantId: number
    participantName: string
    gamesPlayed: number
    wins: number
    draws: number
    losses: number
    goalsFor: number
    goalsAgainst: number
    points: number
}

export interface LandingPageSection {
    name: string;
    events?: EventWithBetOffers[];
    range?: Range
}

export interface LandingPage {
    result: LandingPageSection[]
}

export interface SoonPage {
    events: EventWithBetOffers[];
}

export interface ListView {
    events: EventWithBetOffers[];
}

export interface EventView {
    betoffers: BetOffer[]
    events: Event[]
}

export interface PushMessage {
    t: string
    mt: number
    boou?: OddsUpdated
    boor?: OddsUpdated
    bor?: BetOfferRemoved
    boa?: BetOfferAdded
    bosu?: BetOfferStatusUpdate
    stats?: EventStatsUpdate
    score?: EventScoreUpdate
    abos?: AllBetOffersSuspended
    mcu?: MatchClockUpdated
    mcr?: MatchClockRemoved
    er?: EventRemoved
}

export interface OutcomeUpdate {
    id: number
    odds: number
    betOfferId: number
    oddsFractional: string
    oddsAmerican: string
}

export interface OddsUpdated {
    eventId: number
    outcomes: OutcomeUpdate[]
}


export interface BetOfferRemoved {
    betOfferId: number
}

export interface BetOfferAdded {
    betOffer: BetOffer
}

export interface BetOfferStatusUpdate {
    betOfferId: number
    eventId: number
    suspended: boolean
    visible: boolean
}

export interface EventScoreUpdate {
    eventId: number
    score: Score
}

export interface EventStatsUpdate {
    eventId: number
    statistics: EventStats
}

export interface AllBetOffersSuspended {
    eventId: number
}

export interface MatchClockRemoved {
    eventId: number
}

export interface EventRemoved {
    eventId: number
}

export interface MatchClockUpdated {
    eventId: number
    matchClock: MatchClock
}

