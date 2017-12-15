import * as types from "./types"
import {LiveEvents} from "api/typings";
import {Dispatch} from "redux";

export interface LiveStartLoadAction {
    type: types.LIVE_START_LOADING_TYPE
}

export interface LiveLoadSuccessAction {
    type: types.LIVE_LOAD_SUCCESS_TYPE,
    data: LiveEvents
}

export interface LiveLoadFailedAction {
    type: types.LIVE_LOAD_FAILED_TYPE
}

export type LiveLoadAction = LiveStartLoadAction | LiveLoadSuccessAction | LiveLoadFailedAction

export function loadOpenForLive(fireStartLoading: boolean = true): Dispatch<LiveLoadAction> {
    return async dispatch => {
        if (fireStartLoading) {
            dispatch({type: types.LIVE_START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/event/live/open.json?lang=en_GB&market=GB&client_id=2&channel_id=1');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch live took " + (end - start) + " ms.")
            dispatch({
                type: types.LIVE_LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.LIVE_LOAD_FAILED})
        }
    };
}
