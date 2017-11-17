import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LiveLoadAction} from "store/live/actions"
import {BetOffer, LandingEvent, LiveEvent, Outcome} from "api/typings";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {BetOfferEntity} from "model/BetOfferEntity";
import {Map} from "immutable"
import {LANDING_LOAD_SUCCESS} from "store/landing/types";
import {LandingLoadAction} from "store/landing/actions";
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

export default function entityReducer(state: EntityStore = initialState, action: LiveLoadAction | LandingLoadAction): EntityStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                events: mergeLiveEvents(state.events, liveEvents),
                betoffers: mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer)))
            }
        case LANDING_LOAD_SUCCESS:
            let landingEvents: LandingEvent[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)

            return {
                events: mergeLandingEvents(state.events, landingEvents),
                betoffers: state.betoffers,  // mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: state.outcomes // mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer)))
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

function mergeLandingEvents(state: Map<number, EventEntity>, events: LandingEvent[]): Map<number, EventEntity> {
    for (let landingEvent of events) {
        // TODO: should merge in changes
        state = state.set(landingEvent.event.id, {
            ...landingEvent.event,
            mainBetOfferId: landingEvent.betOffers && landingEvent.betOffers[0].id
        })
    }

    return state
}

function mergeBetOffers(state: Map<number, BetOfferEntity>, betoffers: (BetOffer | undefined)[]): Map<number, BetOfferEntity> {
    for (let bo of betoffers) {
        if (!bo) {
            continue
        }

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


