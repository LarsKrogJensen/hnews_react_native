export interface Path {
    id: number;
    name: string;
    englishName: string;
    termKey: string;
}

export interface Home {
    shirtColor1: string;
    shirtColor2: string;
}

export interface Away {
    shirtColor1: string;
    shirtColor2: string;
}

export interface TeamColors {
    home: Home;
    away: Away;
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

export interface Home2 {
    yellowCards: number;
    redCards: number;
    corners: number;
}

export interface Away2 {
    yellowCards: number;
    redCards: number;
    corners: number;
}

export interface Football {
    home: Home2;
    away: Away2;
}

export interface Sets {
    home: number[];
    away: number[];
    homeServe: boolean;
}

export interface Statistics {
    football: Football;
    sets: Sets;
}

export interface LiveStatistic {
    occurrenceTypeId: string;
    count: number;
}

export interface LiveData {
    eventId: number;
    matchClock: MatchClock;
    score: Score;
    open: boolean;
    visualizationSupported: boolean;
    statistics: Statistics;
    liveStatistics: LiveStatistic[];
}

export interface Criterion {
    id: number;
    label: string;
    englishLabel: string;
    order: number[];
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

export interface Outcome {
    id: any;
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
    mainBetOffer: BetOffer;
}

export interface Group4 {
    id: number;
    name: string;
    englishName: string;
    sortOrder: string;
    sport: string;
    termKey: string;
}

export interface EventGroup {
    id: number;
    name: string;
    englishName: string;
    groups: EventGroup[];
    sortOrder: string;
    sport: string;
    termKey: string;
}

export interface RootGroup {
    id: number;
    groups: EventGroup[];
    sport: string;
}

export interface LiveEvents {
    liveEvents: LiveEvent[];
    group: RootGroup;
}