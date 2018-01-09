import {LandingPage} from "api/typings";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";
import {DispatchAction} from "store/DispatchAction";

export enum LandingActions {
    START_LOADING = "LANDING_START_LOADING",
    LOAD_SUCCESS = "LANDING_LOAD_SUCCESS",
    LOAD_FAILED = "LANDING_LOAD_FAILED"
}

export type LandingStartAction = DispatchAction<LandingActions.START_LOADING>
export type LandingFailedAction = DispatchAction<LandingActions.LOAD_FAILED>

export interface LandingSuccessAction extends DispatchAction<LandingActions.LOAD_SUCCESS> {
    data: LandingPage
}

export type LandingAction = LandingStartAction | LandingSuccessAction | LandingFailedAction

export function loadLanding(fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<LandingStartAction>({type: LandingActions.START_LOADING})

        try {
            console.time("Fetching landing")
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/betoffer/landing.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<LandingSuccessAction>({
                    type: LandingActions.LOAD_SUCCESS,
                    data: responseJson
                });
            } else {
                console.warn(`Failed to fetch landing msg: ${response.statusText}`)
                dispatch<LandingFailedAction>({type: LandingActions.LOAD_FAILED})
            }
            console.timeEnd("Fetching landing")
        } catch (error) {
            console.error(error);
            dispatch<LandingFailedAction>({type: LandingActions.LOAD_FAILED})
        }
    };
}
