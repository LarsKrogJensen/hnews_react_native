import {
    AllBetOffersSuspended,
    BetOfferAdded, BetOfferRemoved, BetOfferStatusUpdate, EventRemoved, EventScoreUpdate, EventStatsUpdate,
    MatchClockRemoved,
    MatchClockUpdated, Occurence,
    OddsUpdated
} from "api/typings";

export enum PushActions {
    ODDS_UPDATE = "ODDS_UPDATE",
    BETOFFER_REMOVED = "BETOFFER_REMOVED",
    BETOFFER_ADDED = "BETOFFER_ADDED",
    BETOFFER_STATUS_UPDATE = "BETOFFER_STATUS_UPDATE",
    ALL_BETOFFERS_SUSPENDED = "ALL_BETOFFERS_SUSPENDED",
    EVENT_STATS_UPDATE = "EVENT_STATS_UPDATE",
    EVENT_SCORE_UPDATE = "EVENT_SCORE_UPDATE",
    MATCH_CLOCK_UPDATED = "MATCH_CLOCK_UPDATED",
    MATCH_CLOCK_REMOVED = "MATCH_CLOCK_REMOVED",
    EVENT_REMOVED = "EVENT_REMOVED",
    MATCH_OCCURENCE = "MATCH_OCCURENCE",
}

export interface PushActionBase<T, D> {
    type: T
    data: D
}

export type OddsUpdateAction = PushActionBase<PushActions.ODDS_UPDATE, OddsUpdated>
export type BetOfferRemovedAction = PushActionBase<PushActions.BETOFFER_REMOVED, BetOfferRemoved>
export type BetOfferAddedAction = PushActionBase<PushActions.BETOFFER_ADDED, BetOfferAdded>
export type BetOfferStatusUpdateAction = PushActionBase<PushActions.BETOFFER_STATUS_UPDATE, BetOfferStatusUpdate>
export type EventStatsUpdateAction = PushActionBase<PushActions.EVENT_STATS_UPDATE, EventStatsUpdate>
export type EventScoreUpdateAction = PushActionBase<PushActions.EVENT_SCORE_UPDATE, EventScoreUpdate>
export type AllBetOffersSuspendedAction = PushActionBase<PushActions.ALL_BETOFFERS_SUSPENDED, AllBetOffersSuspended>
export type MatchClockUpdatedAction = PushActionBase<PushActions.MATCH_CLOCK_UPDATED, MatchClockUpdated>
export type MatchClockRemovedAction = PushActionBase<PushActions.MATCH_CLOCK_REMOVED, MatchClockRemoved>
export type EventRemovedAction = PushActionBase<PushActions.EVENT_REMOVED, EventRemoved>
export type MatchOccurenceAction = PushActionBase<PushActions.MATCH_OCCURENCE, Occurence>


export type PushAction = OddsUpdateAction | BetOfferRemovedAction | BetOfferAddedAction |
    BetOfferStatusUpdateAction | EventScoreUpdateAction | EventStatsUpdateAction | AllBetOffersSuspendedAction |
    MatchClockRemovedAction | MatchClockUpdatedAction | EventRemovedAction | MatchOccurenceAction