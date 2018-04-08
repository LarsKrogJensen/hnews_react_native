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

export function loadSport(
    sport: string,
    region: string,
    league: string,
    participant: string,
    filter: "matches" | "competitions",
    fireStartLoad: boolean = true
): ThunkAction<void, AppStore, any> {

    return async dispatch => {
        const key = `${sport}.${region}.${league}.${participant}.${filter}`
        fireStartLoad && dispatch<SportAction>({type: SportActions.START_LOADING, key})

        try {
            const label = `Fetching sport (${sport}/${region}/${league}/${participant}/${filter})`;
            console.time(label)
            let url = `${API.host}/offering/api/v3/${API.offering}/listView/${sport}/${region}/${league}/${participant}/${filter}.json?lang=${API.lang}&market=${API.market}&categoryGroup=COMBINED&displayDefault=true`;
            const response = await fetch(url);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<SportSuccessAction>({
                    type: SportActions.LOAD_SUCCESS,
                    key,
                    data: responseJson
                });
            } else {
                console.warn("Bad status code on sports load: " + response.status + " url: " + url);
                dispatch<SportFailedAction>({type: SportActions.LOAD_FAILED, key})
            }
            console.timeEnd(label)
        } catch (error) {
            console.error(error);
            dispatch<SportFailedAction>({type: SportActions.LOAD_FAILED, key})
        }
    };
}
