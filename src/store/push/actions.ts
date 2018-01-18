import {OddsUpdated} from "api/typings";

export enum PushActions {
    ODDS_UPDATE = "ODDS_UPDATE",

}


export interface PushActionBase<T, D> {
    type: T
    data: D
}


export type OddsUpdateAction = PushActionBase<PushActions.ODDS_UPDATE, OddsUpdated>


export type PushAction = OddsUpdateAction