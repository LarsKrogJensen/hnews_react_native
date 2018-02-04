import {EventGroup, H2HResponse, LeagueTable, LiveData, TPIResponse} from "api/typings";
import {DispatchAction} from "store/DispatchAction";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum LeagueTableActions {
    START_LOADING = "LEAGUETABLE_START_LOADING",
    LOAD_SUCCESS = "LEAGUETABLE_LOAD_SUCCESS",
    LOAD_FAILED = "LEAGUETABLE_LOAD_FAILED"
}

export enum H2HActions {
    START_LOADING = "H2H_START_LOADING",
    LOAD_SUCCESS = "H2H_LOAD_SUCCESS",
    LOAD_FAILED = "H2H_LOAD_FAILED"
}

export enum TPIActions {
    START_LOADING = "TPI_START_LOADING",
    LOAD_SUCCESS = "TPI_LOAD_SUCCESS",
    LOAD_FAILED = "TPI_LOAD_FAILED"
}

export enum LiveDataActions {
    START_LOADING = "LIVE_DATA_START_LOADING",
    LOAD_SUCCESS = "LIVE_DATA_LOAD_SUCCESS",
    LOAD_FAILED = "LIVE_DATA_LOAD_FAILED"
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

export interface H2HStartAction extends DispatchAction<H2HActions.START_LOADING> {
    eventId: number
}

export interface H2HSuccessAction extends DispatchAction<H2HActions.LOAD_SUCCESS> {
    eventId: number
    data: H2HResponse
}

export interface H2HFailedAction extends DispatchAction<H2HActions.LOAD_FAILED> {
    eventId: number
}

export interface TPIStartAction extends DispatchAction<TPIActions.START_LOADING> {
    eventId: number
}

export interface TPISuccessAction extends DispatchAction<TPIActions.LOAD_SUCCESS> {
    eventId: number
    data: TPIResponse
}

export interface TPIFailedAction extends DispatchAction<TPIActions.LOAD_FAILED> {
    eventId: number
}

export interface LiveDataStartAction extends DispatchAction<LiveDataActions.START_LOADING> {
    eventId: number
}

export interface LiveDataSuccessAction extends DispatchAction<LiveDataActions.LOAD_SUCCESS> {
    eventId: number
    data?: LiveData
}

export interface LiveDataFailedAction extends DispatchAction<LiveDataActions.LOAD_FAILED> {
    eventId: number
}

export type StatsAction = LeagueTableStartAction | LeagueTableSuccessAction | LeagueTableFailedAction |
    H2HStartAction | H2HSuccessAction | H2HFailedAction |
    TPIStartAction | TPISuccessAction | TPIFailedAction |
    LiveDataStartAction | LiveDataSuccessAction | LiveDataFailedAction


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

        fireStartLoad && dispatch<StatsAction>({type: LeagueTableActions.START_LOADING, eventGroupId})

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

export function loadHead2Head(eventId: number, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {
        if (getState().statsStore.h2h.has(eventId)) {
            return
        }

        fireStartLoad && dispatch<StatsAction>({type: H2HActions.START_LOADING, eventId})

        try {
            console.time(`Fetching H2H (${eventId})`)
            const response = await fetch(`${API.host}/statistics/api/${API.offering}/h2h/event/${eventId}.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<H2HSuccessAction>({
                    type: H2HActions.LOAD_SUCCESS,
                    eventId,
                    data: responseJson
                });
            } else {
                dispatch<H2HFailedAction>({type: H2HActions.LOAD_FAILED, eventId})
            }
            console.timeEnd(`Fetching H2H (${eventId})`)
        } catch (error) {
            console.error(error);
            dispatch<H2HFailedAction>({type: H2HActions.LOAD_FAILED, eventId})
        }
    };
}

export function loadTeamPerformance(eventId: number, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {
        if (getState().statsStore.tpi.has(eventId)) {
            return
        }

        fireStartLoad && dispatch<StatsAction>({type: TPIActions.START_LOADING, eventId})

        try {
            console.time(`Fetching TPI (${eventId})`)
            const response = await fetch(`${API.host}/statistics/api/${API.offering}/tpi/event/${eventId}.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<TPISuccessAction>({
                    type: TPIActions.LOAD_SUCCESS,
                    eventId,
                    data: responseJson
                });
            } else {
                dispatch<TPIFailedAction>({type: TPIActions.LOAD_FAILED, eventId})
            }
            console.timeEnd(`Fetching TPI (${eventId})`)
        } catch (error) {
            console.error(error);
            dispatch<TPIFailedAction>({type: TPIActions.LOAD_FAILED, eventId})
        }
    }
}

export function loadLiveData(eventId: number, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async (dispatch) => {

        fireStartLoad && dispatch<LiveDataStartAction>({type: LiveDataActions.START_LOADING, eventId})

        try {
            console.time(`Fetching LiveData (${eventId})`)
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/event/${eventId}/livedata.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<LiveDataSuccessAction>({
                    type: LiveDataActions.LOAD_SUCCESS,
                    eventId,
                    data: responseJson
                });
            } else {
                dispatch<LiveDataFailedAction>({type: LiveDataActions.LOAD_FAILED, eventId})
            }
            console.timeEnd(`Fetching LiveData (${eventId})`)
        } catch (error) {
            console.error(error);
            dispatch<LiveDataFailedAction>({type: LiveDataActions.LOAD_FAILED, eventId})
        }
    }
}