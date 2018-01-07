import {SoonPage} from "api/typings";
import {Dispatch} from "redux";

export enum SoonActions {
    START_LOADING = "SOON_START_LOADING",
    LOAD_SUCCESS = "SOON_LOAD_SUCCESS",
    LOAD_FAILED = "SOON_LOAD_FAILED"
}

export interface SoonStartLoadAction {
    type: SoonActions.START_LOADING
}

export interface SoonLoadSuccessAction {
    type: SoonActions.LOAD_SUCCESS
    data: SoonPage
}

export interface SoonLoadFailedAction {
    type: SoonActions.LOAD_FAILED
}

export type SoonLoadAction = SoonStartLoadAction | SoonLoadSuccessAction | SoonLoadFailedAction

export function load(fireStartLoad: boolean = true): Dispatch<SoonLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: SoonActions.START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v3/kambiplay/listView/all/all/all/all/starting-soon.json?lang=en_GB&market=GB&client_id=2&channel_id=1&ncid=1511542067294&categoryGroup=COMBINED&displayDefault=true');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch starting soon took " + (end - start) + " ms.")
            dispatch({
                type: SoonActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: SoonActions.LOAD_FAILED})
        }
    };
}
