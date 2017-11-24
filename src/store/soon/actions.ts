import * as types from "./types"
import {SoonPage} from "api/typings";
import {Dispatch} from "redux";

export interface SoonStartLoadAction {
    type: types.SOON_START_LOADING_TYPE
}

export interface SoonLoadSuccessAction {
    type: types.SOON_LOAD_SUCCESS_TYPE,
    data: SoonPage
}

export interface SoonLoadFailedAction {
    type: types.SOON_LOAD_FAILED_TYPE
}

export type SoonLoadAction = SoonStartLoadAction | SoonLoadSuccessAction | SoonLoadFailedAction

export function load(): Dispatch<SoonLoadAction> {
    return async dispatch => {
        dispatch({type: types.SOON_START_LOADING})

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v3/kambiplay/listView/all/all/all/all/starting-soon.json?lang=en_GB&market=GB&client_id=2&channel_id=1&ncid=1511542067294&categoryGroup=COMBINED&displayDefault=true');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch starting soon took " + (end - start) + " ms.")
            dispatch({
                type: types.SOON_LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.SOON_LOAD_FAILED})
        }
    };
}
