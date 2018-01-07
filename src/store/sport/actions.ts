import {ListView} from "api/typings";
import {Dispatch} from "redux";

export enum SportActions {
    START_LOADING = "SPORT_START_LOADING",
    LOAD_SUCCESS = "SPORT_LOAD_SUCCESS",
    LOAD_FAILED = "SPORT_LOAD_FAILED"
}

export interface SportStartLoadAction {
    type: SportActions.START_LOADING
    key: string
}

export interface SportLoadSuccessAction {
    type: SportActions.LOAD_SUCCESS
    key: string
    data: ListView
}

export interface SportLoadFailedAction {
    type: SportActions.LOAD_FAILED
    key: string
}

export type SportLoadAction = SportStartLoadAction | SportLoadSuccessAction | SportLoadFailedAction

export function loadSport(sport: string, region: string, league: string, fireStartLoad: boolean = true): Dispatch<SportLoadAction> {
    return async dispatch => {
        const key = `${sport}.${region}.${league}`
        if (fireStartLoad) {
            dispatch({type: SportActions.START_LOADING, key})
        }

        console.log(`Fetching sport (${sport}/${region}/${league})`)
        try {
            const start = new Date().getTime();
            const response =
                await fetch(`https://e4-api.kambi.com/offering/api/v3/kambiplay/listView/${sport}/${region}/${league}.json?lang=en_GB&market=GB&client_id=2&channel_id=1&ncid=1511542067294&categoryGroup=COMBINED&displayDefault=true`);
            const responseJson = await response.json();
            if (response.status === 200) {
                const end = new Date().getTime();
                console.log(`Fetch sport (${sport}/${region}/${league}) took ${(end - start)} ms.`)
                dispatch({
                    type: SportActions.LOAD_SUCCESS,
                    key,
                    data: responseJson
                });
            } else {
                console.warn("Bad status code on sports load: " + response.status);
                dispatch({type: SportActions.LOAD_SUCCESS, key})
            }
        } catch (error) {
            console.error(error);
            dispatch({type: SportActions.LOAD_FAILED, key})
        }
    };
}
