import * as types from "./types"
import {LandingPage} from "api/typings";
import {Dispatch} from "redux";

export interface LandingStartLoadAction {
    type: types.LANDING_START_LOADING_TYPE
}

export interface LandingLoadSuccessAction {
    type: types.LANDING_LOAD_SUCCESS_TYPE,
    data: LandingPage
}

export interface LandingLoadFailedAction {
    type: types.LANDING_LOAD_FAILED_TYPE
}

export type LandingLoadAction = LandingStartLoadAction | LandingLoadSuccessAction | LandingLoadFailedAction

export function load(): Dispatch<LandingLoadAction> {
    return async dispatch => {
        dispatch({type: types.LANDING_START_LOADING})

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/betoffer/landing.json?lang=en_GB&market=GB&client_id=2&ncid=1510848251011');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch landing data took " + (end - start) + " ms.")
            dispatch({
                type: types.LANDING_LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.LANDING_LOAD_FAILED})
        }
    };
}
