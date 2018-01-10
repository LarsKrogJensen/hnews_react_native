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


export function loadBetOffers(eventId: number, fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<BetOffersStartAction>({type: BetOfferActions.START_LOADING, eventId})

        try {
            console.time(`Loading betOffers for event ${eventId}`)
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/betoffer/event/${eventId}.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<BetOffersSuccessAction>({
                    type: BetOfferActions.LOAD_SUCCESS,
                    data: responseJson,
                    eventId
                });
            } else {
                console.warn(`Failed to load betOffers for event ${eventId} status code: ${response.status}`)
                dispatch<BetOffersFailedAction>({type: BetOfferActions.LOAD_FAILED, eventId})
            }
            console.timeEnd(`Loading betOffers for event ${eventId}`)
        } catch (error) {
            console.error(error);
            dispatch<BetOffersFailedAction>({type: BetOfferActions.LOAD_FAILED, eventId})
        }
    };
}