import {LiveEvents} from "api/typings";
import {API} from "store/API";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {DispatchAction} from "store/DispatchAction";

export enum LiveActions {
    START_LOADING = "LIVE_START_LOADING",
    LOAD_SUCCESS = "LIVE_LOAD_SUCCESS",
    LOAD_FAILED = "LIVE_LOAD_FAILED"
}

export type LiveStartLoadAction = DispatchAction<LiveActions.START_LOADING>
export type LiveLoadFailedAction = DispatchAction<LiveActions.LOAD_FAILED>

export interface LiveLoadSuccessAction extends DispatchAction<LiveActions.LOAD_SUCCESS> {
    data: LiveEvents
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
