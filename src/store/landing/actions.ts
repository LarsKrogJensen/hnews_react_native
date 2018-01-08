import {LandingPage} from "api/typings";
import {Dispatch} from "redux";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum LandingActions {
    START_LOADING = "LANDING_START_LOADING",
    LOAD_SUCCESS = "LANDING_LOAD_SUCCESS",
    LOAD_FAILED = "LANDING_LOAD_FAILED"
}

export interface LandingStartLoadAction {
    type: LandingActions.START_LOADING
}

export interface LandingLoadSuccessAction {
    type: LandingActions.LOAD_SUCCESS
    data: LandingPage
}

export interface LandingLoadFailedAction {
    type: LandingActions.LOAD_FAILED
}

export type LandingLoadAction = LandingStartLoadAction | LandingLoadSuccessAction | LandingLoadFailedAction

export function loadLanding(fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<LandingStartLoadAction>({type: LandingActions.START_LOADING})

        try {
            console.time("Fetching landing")
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/betoffer/landing.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd("Fetching landing")
            dispatch<LandingLoadSuccessAction>({
                type: LandingActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch<LandingLoadFailedAction>({type: LandingActions.LOAD_FAILED})
        }
    };
}
