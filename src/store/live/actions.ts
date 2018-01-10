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

export type LiveStartAction = DispatchAction<LiveActions.START_LOADING>
export type LiveFailedAction = DispatchAction<LiveActions.LOAD_FAILED>

export interface LiveSuccessAction extends DispatchAction<LiveActions.LOAD_SUCCESS> {
    data: LiveEvents
}

export type LiveAction = LiveStartAction | LiveSuccessAction | LiveFailedAction

export function loadOpenForLive(fireStartLoading: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoading && dispatch<LiveStartAction>({type: LiveActions.START_LOADING})

        try {
            console.time("Fetch live")
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/event/live/open.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<LiveSuccessAction>({
                    type: LiveActions.LOAD_SUCCESS,
                    data: responseJson
                });
            } else {
                console.warn(`Failed to fetch live status code: ${response.status}`)
                dispatch<LiveFailedAction>({type: LiveActions.LOAD_FAILED})
            }
            console.timeEnd("Fetch live")
        } catch (error) {
            console.error(error);
            dispatch<LiveFailedAction>({type: LiveActions.LOAD_FAILED})
        }
    };
}
