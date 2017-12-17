import * as types from "./types"
import {ListView} from "api/typings";
import {Dispatch} from "redux";

export interface SportStartLoadAction {
    type: types.SPORT_START_LOADING_TYPE
    key: string
}

export interface SportLoadSuccessAction {
    type: types.SPORT_LOAD_SUCCESS_TYPE
    key: string
    data: ListView
}

export interface SportLoadFailedAction {
    type: types.SPORT_LOAD_FAILED_TYPE
    key: string
}

export type SportLoadAction = SportStartLoadAction | SportLoadSuccessAction | SportLoadFailedAction

export function loadSport(sport: string, region: string, league: string, fireStartLoad: boolean = true): Dispatch<SportLoadAction> {
    return async dispatch => {
        const key = `${sport}.${region}.${league}`
        if (fireStartLoad) {
            dispatch({type: types.SPORT_START_LOADING, key})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch(`https://e4-api.kambi.com/offering/api/v3/kambiplay/listView/${sport}/${region}/${league}.json?lang=en_GB&market=GB&client_id=2&channel_id=1&ncid=1511542067294&categoryGroup=COMBINED&displayDefault=true`);
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log(`Fetch sport (${sport}/${region}/${league}) took ${(end - start)} ms.`)
            dispatch({
                type: types.SPORT_LOAD_SUCCESS,
                key,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.SPORT_LOAD_FAILED, key})
        }
    };
}
