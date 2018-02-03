import {EventGroup, LeagueTable} from "api/typings";
import {DispatchAction} from "store/DispatchAction";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum LeagueTableActions {
    START_LOADING = "LEAGUETABLE_START_LOADING",
    LOAD_SUCCESS = "LEAGUETABLE_LOAD_SUCCESS",
    LOAD_FAILED = "LEAGUETABLE_LOAD_FAILED"
}

export interface LeagueTableStartAction extends DispatchAction<LeagueTableActions.START_LOADING> {
    eventGroupId: number
}

export interface LeagueTableSuccessAction extends DispatchAction<LeagueTableActions.LOAD_SUCCESS> {
    eventGroupId: number
    data: LeagueTable
}

export interface LeagueTableFailedAction extends DispatchAction<LeagueTableActions.LOAD_FAILED> {
    eventGroupId: number
}

export type LeagueTableAction = LeagueTableStartAction | LeagueTableSuccessAction | LeagueTableFailedAction


export function loadLeagueTable(eventGroupId: number, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {
        if (getState().statsStore.leagueTable.has(eventGroupId)) {
            return
        }

        let eventGroup: EventGroup = getState().groupStore.groupById.get(eventGroupId);
        let sport = "all", region = "all", league = "all"
        if (eventGroup) {
            if (eventGroup.parentGroup) {
                if (eventGroup.parentGroup.parentGroup) {
                    sport = eventGroup.parentGroup.parentGroup.termKey
                    region = eventGroup.parentGroup.termKey
                    league = eventGroup.termKey
                } else {
                    sport = eventGroup.parentGroup.termKey
                    region = eventGroup.termKey
                }
            } else {
                sport = eventGroup.termKey
            }
        }

        fireStartLoad && dispatch<LeagueTableAction>({type: LeagueTableActions.START_LOADING, eventGroupId})

        try {
            console.time(`Fetching league table (${sport}/${region}/${league})`)
            const response = await fetch(`${API.host}/statistics/api/${API.offering}/leaguetable/${sport}/${region}/${league}.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<LeagueTableSuccessAction>({
                    type: LeagueTableActions.LOAD_SUCCESS,
                    eventGroupId,
                    data: responseJson
                });
            } else if (response.status === 404) {
                dispatch<LeagueTableSuccessAction>({
                    type: LeagueTableActions.LOAD_SUCCESS, eventGroupId, data: {
                        eventGroupId,
                        leagueTableRows: []
                    }
                })
            }
            else {
                dispatch<LeagueTableFailedAction>({type: LeagueTableActions.LOAD_FAILED, eventGroupId})
            }
            console.timeEnd(`Fetching league table (${sport}/${region}/${league})`)
        } catch (error) {
            console.error(error);
            dispatch<LeagueTableFailedAction>({type: LeagueTableActions.LOAD_FAILED, eventGroupId})
        }
    };
}