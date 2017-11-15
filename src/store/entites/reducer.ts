import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LiveLoadAction} from "store/live/actions"
import {BetOffer, Outcome, Event} from "api/typings";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {BetOfferEntity} from "model/BetOfferEntity";

export interface EntityStore {
    outcomes: Map<number, OutcomeEntity>
    events: Map<number, EventEntity>
    betoffers: Map<number, BetOfferEntity>
}

const initialState: EntityStore = {
    outcomes: new Map<number, OutcomeEntity>(),
    events: new Map<number, EventEntity>(),
    betoffers: new Map<number, BetOfferEntity>()
}


export default function entityReducer(state: EntityStore = initialState, action: LiveLoadAction): EntityStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            mergeEvents(state, liveEvents.map(e => e.event))
            mergeBetOffers(state, liveEvents.map(e => e.mainBetOffer))
            let outcomes: Outcome[] = liveEvents.filter(e => e.mainBetOffer)
                .map(e => e.mainBetOffer.outcomes)
                .reduce((prev, curr) => prev.concat(curr));
            mergeOutcomes(state, outcomes)
            return state
        default:
            return state
    }
}

function mergeBetOffers(state: EntityStore, betoffers: BetOffer[]) {
    for (let bo of betoffers.filter(b => b)) {
        // remove stuff not used
        const {outcomes, criterion, oddsStats, betOfferType, pba, ...rest} = bo
        // project outcomes into an number array
        let outcomesIds = outcomes && outcomes.map(oc => oc.id) || [];
        state.betoffers.set(bo.id, {...rest, outcomes: outcomesIds})
        mergeOutcomes(state, bo.outcomes)
    }
}

function mergeOutcomes(state: EntityStore, outcomes: Outcome[]) {
    for (let outcome of outcomes) {
        state.outcomes.set(outcome.id, outcome) // for now Outcome is structural equal to OutcomeEntity
    }
}

function mergeEvents(state: EntityStore, events: Event[]) {
    for (let evt of events) {
        state.events.set(evt.id, evt)
    }
}


