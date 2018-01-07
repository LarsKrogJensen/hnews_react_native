import {LandingPage} from "api/typings";
import {Dispatch} from "redux";

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

export function loadLanding(fireStartLoad: boolean = true): Dispatch<LandingLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: LandingActions.START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/betoffer/landing.json?lang=en_GB&market=GB&client_id=2&ncid=1510848251011');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch landing data took " + (end - start) + " ms.")
            dispatch({
                type: LandingActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: LandingActions.LOAD_FAILED})
        }
    };
}
