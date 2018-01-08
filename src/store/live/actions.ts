import {LiveEvents} from "api/typings";
import {Dispatch} from "redux";
import {API} from "store/API";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";

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

export function loadOpenForLive(fireStartLoading: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoading && dispatch<LiveStartLoadAction>({type: LiveActions.START_LOADING})

        try {
            console.time("Fetch live")
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/event/live/open.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd("Fetch live")
            dispatch<LiveLoadSuccessAction>({
                type: LiveActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch<LiveLoadFailedAction>({type: LiveActions.LOAD_FAILED})
        }
    };
}
