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

export function load(): Dispatch<LiveLoadAction> {
    return async dispatch => {
        dispatch({type: types.LIVE_START_LOADING})

        try {
            const response =
                await fetch('https://e1-api.aws.kambicdn.com/offering/api/v2/ub/event/live/open.json?lang=sv_SE&market=SE&client_id=2&channel_id=1');
            const responseJson = await response.json();
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
