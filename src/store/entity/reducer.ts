import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LANDING_LOAD_SUCCESS} from "store/landing/types";
import {SOON_LOAD_SUCCESS} from "store/soon/types";
import {SPORT_LOAD_SUCCESS} from "store/sport/types";
import {LiveLoadAction} from "store/live/actions"
import {SportLoadAction} from "store/sport/actions";
import {SoonLoadAction} from "store/soon/actions";
import {LandingLoadAction} from "store/landing/actions";
import {BetOffer, EventWithBetOffers, LiveEvent, Outcome} from "api/typings";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {BetOfferEntity} from "model/BetOfferEntity";


import {Map} from "immutable"
import * as _ from "lodash"

export interface EntityStore {
    events: Map<number, EventEntity>
    betoffers: Map<number, BetOfferEntity>
    outcomes: Map<number, OutcomeEntity>
}

const initialState: EntityStore = {
    events: Map<number, EventEntity>(),
    betoffers: Map<number, BetOfferEntity>(),
    outcomes: Map<number, OutcomeEntity>()
}

export default function entityReducer(state: EntityStore = initialState, action: LiveLoadAction | LandingLoadAction | SoonLoadAction | SportLoadAction): EntityStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                events: mergeLiveEvents(state.events, liveEvents),
                betoffers: mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer)))
            }
        case LANDING_LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let betoffers: BetOffer[] = _.flatMap(landingEvents.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, landingEvents),
                betoffers: mergeBetOffers(state.betoffers, betoffers),
                outcomes: mergeOutcomes(state.outcomes, _.flatMap(betoffers.map(bo => bo.outcomes)))
            }
        case SOON_LOAD_SUCCESS:
        case SPORT_LOAD_SUCCESS:
            let events: EventWithBetOffers[] = action.data.events
            let betoffers2: BetOffer[] = _.flatMap(events.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, events),
                betoffers: mergeBetOffers(state.betoffers, betoffers2),
                outcomes: mergeOutcomes(state.outcomes, _.flatMap(betoffers2.map(bo => bo.outcomes)))
            }
        default:
            return state
    }
}

function mergeLiveEvents(state: Map<number, EventEntity>, events: LiveEvent[]): Map<number, EventEntity> {
    for (let liveEvent of events) {
        // TODO: should merge in changes
        state = state.set(liveEvent.event.id, {
            ...liveEvent.event,
            mainBetOfferId: liveEvent.mainBetOffer && liveEvent.mainBetOffer.id
        })
    }

    return state
}

function mergeEventWithBetOffers(state: Map<number, EventEntity>, events: EventWithBetOffers[]): Map<number, EventEntity> {
    for (let landingEvent of events) {
        // TODO: should merge in changes
        state = state.set(landingEvent.event.id, {
            ...landingEvent.event,
            mainBetOfferId: landingEvent.betOffers && landingEvent.betOffers[0] && landingEvent.betOffers[0].id
        })
    }

    return state
}

function mergeBetOffers(state: Map<number, BetOfferEntity>, betoffers: (BetOffer | undefined)[]): Map<number, BetOfferEntity> {
    for (let bo of betoffers) {
        if (!bo) {
            continue
        }

        // noinspection JSUnusedLocalSymbols
        const {outcomes, criterion, oddsStats, betOfferType, pba, ...rest} = bo
        let outcomesIds = outcomes && outcomes.map(oc => oc.id) || [];
        
        // TODO: should merge in changes
        state = state.set(bo.id, {...rest, outcomes: outcomesIds})
    }
    return state
}

function mergeOutcomes(state: Map<number, OutcomeEntity>, outcomes: Outcome[]): Map<number, OutcomeEntity> {
    for (let outcome of outcomes) {
        if (outcome) {

            // TODO: should merge in changes
            state = state.set(outcome.id, outcome) // for now Outcome is structural equal to OutcomeEntity
        }
    }

    return state;
}

function flatMapOutcomes(betoffers: (BetOffer | undefined)[]): Outcome[] {
    return betoffers
        .map(bo => bo && bo.outcomes || [])
        .filter(outcomes => outcomes)
        .reduce((prev, curr) => prev.concat(curr))
}


