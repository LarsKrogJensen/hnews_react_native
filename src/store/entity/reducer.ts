import {LiveActions, LiveLoadAction} from "store/live/actions"
import {SportActions, SportLoadAction} from "store/sport/actions";
import {SoonActions, SoonLoadAction} from "store/soon/actions";
import {LandingActions, LandingLoadAction} from "store/landing/actions";
import {BetOffer, EventView, EventWithBetOffers, LiveEvent, Outcome} from "api/typings";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {BetOfferEntity} from "model/BetOfferEntity";


import {Map, Set} from "immutable"
import * as _ from "lodash"
import {BetOfferActions, BetOffersLoadAction} from "store/entity/actions";

export interface EntityStore {
    events: Map<number, EventEntity>
    betoffers: Map<number, BetOfferEntity>
    outcomes: Map<number, OutcomeEntity>
    loading: Set<number>
}

const initialState: EntityStore = {
    events: Map<number, EventEntity>(),
    betoffers: Map<number, BetOfferEntity>(),
    outcomes: Map<number, OutcomeEntity>(),
    loading: Set()
}

type Actions = LiveLoadAction | LandingLoadAction | SoonLoadAction | SportLoadAction | BetOffersLoadAction
export default function entityReducer(state: EntityStore = initialState, action: Actions): EntityStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                events: mergeLiveEvents(state.events, liveEvents),
                betoffers: mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer))),
                loading: state.loading
            }
        case LandingActions.LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let betoffers: BetOffer[] = _.flatMap(landingEvents.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, landingEvents),
                betoffers: mergeBetOffers(state.betoffers, betoffers),
                outcomes: mergeOutcomes(state.outcomes, _.flatMap(betoffers.map(bo => bo.outcomes))),
                loading: state.loading
            }
        case SoonActions.LOAD_SUCCESS:
        case SportActions.LOAD_SUCCESS:
            let events: EventWithBetOffers[] = action.data.events
            let betoffers2: BetOffer[] = _.flatMap(events.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, events),
                betoffers: mergeBetOffers(state.betoffers, betoffers2),
                outcomes: mergeOutcomes(state.outcomes, _.flatMap(betoffers2.map(bo => bo.outcomes))),
                loading: state.loading
            }
        case BetOfferActions.START_LOADING:
            return {
                ...state,
                loading: state.loading.add(action.eventId)
            }
        case BetOfferActions.LOAD_SUCCESS:
            return {
                events: mergeEventView(state.events, action.data),
                betoffers: mergeBetOffers(state.betoffers, action.data.betoffers),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(action.data.betoffers)),
                loading: state.loading.remove(action.eventId)
            }
        case BetOfferActions.LOAD_FAILED:
            return {
                ...state,
                loading: state.loading.remove(action.eventId)
            }
        default:
            return state
    }
}


function mergeEventView(state: Map<number, EventEntity>, eventView: EventView): Map<number, EventEntity> {
    for (let event of eventView.events) {
        const eventEntity = state.get(event.id)
        let mainBetOfferId = eventEntity && eventEntity.mainBetOfferId

        if (!mainBetOfferId) {
            for (let bo of eventView.betoffers) {
                if (bo.main) {
                    mainBetOfferId = bo.id
                    break;
                }
            }
        }

        state = state.set(event.id, {
            ...event,
            mainBetOfferId: mainBetOfferId,
            betOffers: eventView.betoffers.map(bo => bo.id)
        })
    }

    return state
}

function mergeLiveEvents(state: Map<number, EventEntity>, events: LiveEvent[]): Map<number, EventEntity> {
    for (let liveEvent of events) {
        const eventEntity = state.get(liveEvent.event.id)

        state = state.set(liveEvent.event.id, {
            ...liveEvent.event,
            mainBetOfferId: liveEvent.mainBetOffer && liveEvent.mainBetOffer.id,
            betOffers: eventEntity && eventEntity.betOffers || []
        })
    }

    return state
}

function mergeEventWithBetOffers(state: Map<number, EventEntity>, events: EventWithBetOffers[]): Map<number, EventEntity> {
    for (let landingEvent of events) {
        const eventEntity = state.get(landingEvent.event.id)

        state = state.set(landingEvent.event.id, {
            ...landingEvent.event,
            mainBetOfferId: landingEvent.betOffers && landingEvent.betOffers[0] && landingEvent.betOffers[0].id,
            betOffers: eventEntity && eventEntity.betOffers || []
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
        const {outcomes, oddsStats, pba, ...rest} = bo
        let outcomesIds = outcomes && outcomes.map(oc => oc.id) || [];

        // TODO: should merge in changes
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

function flatMapOutcomes(betoffers: (BetOffer | undefined)[]): Outcome[] {
    return betoffers
        .map(bo => bo && bo.outcomes || [])
        .filter(outcomes => outcomes)
        .reduce((prev, curr) => prev.concat(curr))
}


