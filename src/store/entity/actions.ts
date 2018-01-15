import {EventView} from "api/typings";
import {API} from "store/API";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {DispatchAction} from "store/DispatchAction";

export enum BetOfferActions {
    START_LOADING = "BETOFFERS_START_LOADING",
    LOAD_SUCCESS = "BETOFFERS_LOAD_SUCCESS",
    LOAD_FAILED = "BETOFFERS_LOAD_FAILED"
}

export interface BetOffersStartAction extends DispatchAction<BetOfferActions.START_LOADING> {
    eventId: number
}

export interface BetOffersSuccessAction extends DispatchAction<BetOfferActions.LOAD_SUCCESS> {
    eventId: number
    data: EventView
}

export interface BetOffersFailedAction extends DispatchAction<BetOfferActions.LOAD_FAILED> {
    eventId: number
}

export type BetOffersAction = BetOffersStartAction | BetOffersSuccessAction | BetOffersFailedAction


export function loadBetOffers(eventId: number, live: boolean, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<BetOffersStartAction>({type: BetOfferActions.START_LOADING, eventId})

        try {
            let timerName = `Loading betOffers for event ${eventId} live ${live}`;
            console.time(timerName)
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/betoffer/${live ? "live/" : ""}event/${eventId}.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<BetOffersSuccessAction>({
                    type: BetOfferActions.LOAD_SUCCESS,
                    data: responseJson,
                    eventId
                });
            } else {
                console.warn(`${timerName} status code: ${response.status}`)
                dispatch<BetOffersSuccessAction>({
                    type: BetOfferActions.LOAD_SUCCESS,
                    eventId,
                    data: {
                        events: [],
                        betoffers: []
                    }
                })
            }
            console.timeEnd(timerName)
        } catch (error) {
            console.error(error);
            dispatch<BetOffersFailedAction>({type: BetOfferActions.LOAD_FAILED, eventId})
        }
    };
}