import {ListView} from "api/typings";
import {DispatchAction} from "store/DispatchAction";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum SportActions {
    START_LOADING = "SPORT_START_LOADING",
    LOAD_SUCCESS = "SPORT_LOAD_SUCCESS",
    LOAD_FAILED = "SPORT_LOAD_FAILED"
}

export interface SportStartAction extends DispatchAction<SportActions.START_LOADING> {
    key: string
}

export interface SportSuccessAction extends DispatchAction<SportActions.LOAD_SUCCESS> {
    key: string
    data: ListView
}

export interface SportFailedAction extends DispatchAction<SportActions.LOAD_FAILED> {
    key: string
}

export type SportAction = SportStartAction | SportSuccessAction | SportFailedAction

export function loadSport(sport: string, region: string, league: string, filter: "matches" | "competitions", fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        const key = `${sport}.${region}.${league}`
        fireStartLoad && dispatch<SportAction>({type: SportActions.START_LOADING, key})

        try {
            console.time(`Fetching sport (${sport}/${region}/${league})`)
            const response = await fetch(`${API.host}/offering/api/v3/${API.offering}/listView/${sport}/${region}/${league}/all/${filter}.json?lang=${API.lang}&market=${API.market}&categoryGroup=COMBINED&displayDefault=true`);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<SportSuccessAction>({
                    type: SportActions.LOAD_SUCCESS,
                    key,
                    data: responseJson
                });
            } else {
                console.warn("Bad status code on sports load: " + response.status);
                dispatch<SportFailedAction>({type: SportActions.LOAD_FAILED, key})
            }
            console.timeEnd(`Fetching sport (${sport}/${region}/${league})`)
        } catch (error) {
            console.error(error);
            dispatch<SportFailedAction>({type: SportActions.LOAD_FAILED, key})
        }
    };
}
