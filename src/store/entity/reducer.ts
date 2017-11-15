import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LiveLoadAction} from "store/live/actions"
import {BetOffer, Event, Outcome} from "api/typings";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {BetOfferEntity} from "model/BetOfferEntity";
import {Map} from "immutable"

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


export default function entityReducer(state: EntityStore = initialState, action: LiveLoadAction): EntityStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                events: mergeEvents(state.events, liveEvents.map(e => e.event)),
                betoffers: mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer)))
            }
        default:
            return state
    }
}

function mergeEvents(state: Map<number, EventEntity>, events: Event[]): Map<number, EventEntity> {
    for (let evt of events) {
        state = state.set(evt.id, evt)
    }

    return state
}

function mergeBetOffers(state: Map<number, BetOfferEntity>, betoffers: BetOffer[]): Map<number, BetOfferEntity> {
    for (let bo of betoffers) {
        if (!bo) continue
        // remove stuff not used
        const {outcomes, criterion, oddsStats, betOfferType, pba, ...rest} = bo
        // project outcomes into an number array
        let outcomesIds = outcomes && outcomes.map(oc => oc.id) || [];
        state = state.set(bo.id, {...rest, outcomes: outcomesIds})
    }
    return state
}

function mergeOutcomes(state: Map<number, OutcomeEntity>, outcomes: Outcome[]): Map<number, OutcomeEntity> {
    for (let outcome of outcomes) {
        if (outcome) {
            state = state.set(outcome.id, outcome) // for now Outcome is structural equal to OutcomeEntity
        }
    }

    return state;
}

function flatMapOutcomes(betoffers: BetOffer[]): Outcome[] {
    return betoffers.filter(bo => bo)
        .map(bo => bo.outcomes)
        .filter(outcomes => outcomes)
        .reduce((prev, curr) => prev.concat(curr))
}


