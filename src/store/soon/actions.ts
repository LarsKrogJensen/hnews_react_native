import {SoonPage} from "api/typings";
import {DispatchAction} from "store/DispatchAction";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum SoonActions {
    START_LOADING = "SOON_START_LOADING",
    LOAD_SUCCESS = "SOON_LOAD_SUCCESS",
    LOAD_FAILED = "SOON_LOAD_FAILED"
}

export type SoonStartAction = DispatchAction<SoonActions.START_LOADING>
export type SoonFailedAction = DispatchAction<SoonActions.LOAD_FAILED>

export interface SoonSuccessAction extends DispatchAction<SoonActions.LOAD_SUCCESS> {
    data: SoonPage
}

export type SoonAction = SoonStartAction | SoonSuccessAction | SoonFailedAction

export function load(fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<SoonStartAction>({type: SoonActions.START_LOADING})

        try {
            console.time("Fetching starting soon")
            const response = await fetch(`${API.host}/offering/api/v3/${API.offering}/listView/all/all/all/all/starting-soon.json?lang=${API.lang}&market=${API.market}&categoryGroup=COMBINED&displayDefault=true`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<SoonSuccessAction>({
                    type: SoonActions.LOAD_SUCCESS,
                    data: responseJson
                });
            } else {
                console.warn(`Failed to fetch starting soon status code: ${response.status}`)
                dispatch<SoonFailedAction>({type: SoonActions.LOAD_FAILED})
            }
            console.timeEnd("Fetching starting soon")
        } catch (error) {
            console.error(error);
            dispatch<SoonFailedAction>({type: SoonActions.LOAD_FAILED})
        }
    };
}
