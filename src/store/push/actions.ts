import {BetOfferAdded, BetOfferRemoved, OddsUpdated} from "api/typings";

export enum PushActions {
    ODDS_UPDATE = "ODDS_UPDATE",
    BETOFFER_REMOVED = "BETOFFER_REMOVED",
    BETOFFER_ADDED = "BETOFFER_ADDED"
}


export interface PushActionBase<T, D> {
    type: T
    data: D
}


export type OddsUpdateAction = PushActionBase<PushActions.ODDS_UPDATE, OddsUpdated>
export type BetOfferRemovedAction = PushActionBase<PushActions.BETOFFER_REMOVED, BetOfferRemoved>
export type BetOfferAddedAction = PushActionBase<PushActions.BETOFFER_ADDED, BetOfferAdded>


export type PushAction = OddsUpdateAction | BetOfferRemovedAction | BetOfferAddedAction