import {LiveEvents} from "api/typings";
import {Dispatch} from "redux";

export enum LiveActions {
    START_LOADING = "LIVE_START_LOADING",
    LOAD_SUCCESS = "LIVE_LOAD_SUCCESS",
    LOAD_FAILED = "LIVE_LOAD_FAILED"
}

export interface LiveStartLoadAction {
    type: LiveActions.START_LOADING
}

export interface LiveLoadSuccessAction {
    type: LiveActions.LOAD_SUCCESS,
    data: LiveEvents
}

export interface LiveLoadFailedAction {
    type: LiveActions.LOAD_FAILED
}

export type LiveLoadAction = LiveStartLoadAction | LiveLoadSuccessAction | LiveLoadFailedAction

const URL = 'https://e4-api.kambi.com/offering/api/v2/kambiplay/event/live/open.json?lang=en_GB&market=GB&client_id=2&channel_id=1';
export function loadOpenForLive(fireStartLoading: boolean = true): Dispatch<LiveLoadAction> {
    return async dispatch => {
        if (fireStartLoading) {
            dispatch({type: LiveActions.START_LOADING})
        }

        try {
            console.time("Fetch live")
            const response = await fetch(URL);
            const responseJson = await response.json();
            console.timeEnd("Fetch live")
            dispatch({
                type: LiveActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: LiveActions.LOAD_FAILED})
        }
    };
}
