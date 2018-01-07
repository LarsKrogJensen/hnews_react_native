import {EventView} from "api/typings";
import {Dispatch} from "redux";
import {API} from "store/API";

export enum BetOfferActions {
    START_LOADING = "BETOFFERS_START_LOADING",
    LOAD_SUCCESS = "BETOFFERS_LOAD_SUCCESS",
    LOAD_FAILED = "BETOFFERS_LOAD_FAILED"
}

export interface BetOffersStartLoadAction {
    type: BetOfferActions.START_LOADING
    eventId: number
}

export interface BetOffersLoadSuccessAction {
    type: BetOfferActions.LOAD_SUCCESS
    eventId: number
    data: EventView
}

export interface BetOffersLoadFailedAction {
    type: BetOfferActions.LOAD_FAILED
    eventId: number
}

export type BetOffersLoadAction = BetOffersStartLoadAction | BetOffersLoadSuccessAction | BetOffersLoadFailedAction


export function loadBetOffers(eventId: number, fireStartLoad: boolean = true): Dispatch<BetOffersLoadAction> {
    return async (dispatch: Dispatch<BetOffersLoadAction>) => {
        fireStartLoad && dispatch({type: BetOfferActions.START_LOADING})
        
        try {
            console.time(`Loading betOffers for event ${eventId}`)
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/betoffer/event/${eventId}.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd(`Loading betOffers for event ${eventId}`)
            dispatch({
                type: BetOfferActions.LOAD_SUCCESS,
                data: responseJson,
                eventId
            });
        } catch (error) {
            console.error(error);
            dispatch({type: BetOfferActions.LOAD_FAILED, eventId})
        }
    };
}