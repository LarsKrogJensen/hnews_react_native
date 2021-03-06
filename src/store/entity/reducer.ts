import {LiveAction, LiveActions} from "store/live/actions"
import {SportAction, SportActions} from "store/sport/actions";
import {SoonAction, SoonActions} from "store/soon/actions";
import {LandingAction, LandingActions} from "store/landing/actions";
import {
    AllBetOffersSuspended,
    BetOffer,
    BetOfferAdded,
    BetOfferRemoved,
    BetOfferStatusUpdate,
    EventRemoved,
    EventView,
    EventWithBetOffers,
    LiveEvent,
    Outcome,
    OutcomeUpdate
} from "api/typings";
import {OutcomeEntity} from "entity/OutcomeEntity";
import {EventEntity} from "entity/EventEntity";
import {BetOfferEntity} from "entity/BetOfferEntity";


import {Map, Set} from "immutable"
import {flatMap} from "lodash"
import {BetOfferActions, BetOffersAction} from "store/entity/actions";
import {PushAction, PushActions} from "store/push/actions";


export interface EntityStore {
    events: Map<number, EventEntity>
    betoffers: Map<number, BetOfferEntity>
    outcomes: Map<number, OutcomeEntity>
    betOffersLoading: Set<number>
}


const initialState: EntityStore = {
    events: Map<number, EventEntity>(),
    betoffers: Map<number, BetOfferEntity>(),
    outcomes: Map<number, OutcomeEntity>(),
    betOffersLoading: Set()
}

type Actions = LiveAction | LandingAction | SoonAction | SportAction | BetOffersAction | PushAction

export function entityReducer(state: EntityStore = initialState, action: Actions): EntityStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                events: mergeLiveEvents(state.events, liveEvents),
                betoffers: mergeBetOffers(state.betoffers, liveEvents.map(e => e.mainBetOffer)),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(liveEvents.map(e => e.mainBetOffer))),
                betOffersLoading: state.betOffersLoading
            }
        case LandingActions.LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let betoffers: BetOffer[] = flatMap(landingEvents.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, landingEvents),
                betoffers: mergeBetOffers(state.betoffers, betoffers),
                outcomes: mergeOutcomes(state.outcomes, flatMap(betoffers.map(bo => bo.outcomes))),
                betOffersLoading: state.betOffersLoading
            }
        case SoonActions.LOAD_SUCCESS:
        case SportActions.LOAD_SUCCESS:
            let events: EventWithBetOffers[] = action.data.events
            let betoffers2: BetOffer[] = flatMap(events.map(e => e.betOffers).filter(bo => bo));

            return {
                events: mergeEventWithBetOffers(state.events, events),
                betoffers: mergeBetOffers(state.betoffers, betoffers2),
                outcomes: mergeOutcomes(state.outcomes, flatMap(betoffers2.map(bo => bo.outcomes))),
                betOffersLoading: state.betOffersLoading
            }
        case BetOfferActions.START_LOADING:
            return {
                ...state,
                betOffersLoading: state.betOffersLoading.add(action.eventId)
            }
        case BetOfferActions.LOAD_SUCCESS:
            return {
                events: mergeEventView(state.events, action.data),
                betoffers: mergeBetOffers(state.betoffers, action.data.betoffers),
                outcomes: mergeOutcomes(state.outcomes, flatMapOutcomes(action.data.betoffers)),
                betOffersLoading: state.betOffersLoading.remove(action.eventId)
            }
        case BetOfferActions.LOAD_FAILED:
            return {
                ...state,
                betOffersLoading: state.betOffersLoading.remove(action.eventId)
            }
        case PushActions.ODDS_UPDATE:
            return {
                ...state,
                outcomes: mergeOutcomeUpadates(state.outcomes, action.data.outcomes)
            }
        case PushActions.BETOFFER_REMOVED:
            return {
                ...state,
                ...mergeBetOfferRemoved(state, action.data)
            }
        case PushActions.BETOFFER_ADDED:
            return {
                ...state,
                ...mergeBetOfferAdded(state, action.data)
            }
        case PushActions.BETOFFER_STATUS_UPDATE:
            return {
                ...state,
                betoffers: mergeBetOfferStatusUpdate(state, action.data)
            }
        case PushActions.ALL_BETOFFERS_SUSPENDED:
            return {
                ...state,
                betoffers: mergeSuspendAllBetOffers(state, action.data)
            }
        case PushActions.EVENT_REMOVED:
            return {
                ...state,
                ...mergeEventRemoved(state, action.data)
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
            mainBetOfferId: liveEvent.mainBetOffer && liveEvent.mainBetOffer.id || eventEntity && eventEntity.mainBetOfferId,
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
            mainBetOfferId: landingEvent.betOffers && landingEvent.betOffers[0] && landingEvent.betOffers[0].id || eventEntity && eventEntity.mainBetOfferId,
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

        state = state.set(bo.id, createBetOfferEntity(bo))
    }
    return state
}

function createBetOfferEntity(betOffer: BetOffer): BetOfferEntity {
    // noinspection JSUnusedLocalSymbols
    const {outcomes, oddsStats, pba, ...rest} = betOffer
    let outcomesIds = outcomes && outcomes.map(oc => oc.id) || [];

    return {...rest, outcomes: outcomesIds}
}

function flatMapOutcomes(betoffers: (BetOffer | undefined)[]): Outcome[] {
    return betoffers
        .map(bo => bo && bo.outcomes || [])
        .filter(outcomes => outcomes)
        .reduce((prev, curr) => prev.concat(curr), [])
}

function mergeOutcomes(state: Map<number, OutcomeEntity>, outcomes: Outcome[]): Map<number, OutcomeEntity> {

    if (outcomes) {
        for (let outcome of outcomes.filter(o => o)) {
            const entity = state.get(outcome.id)
            if (entity) {
                state = state.set(outcome.id, {
                    ...entity,
                    ...outcome
                })
            } else {
                state = state.set(outcome.id, outcome) // for now Outcome is structural equal to OutcomeEntity
            }
        }
    }

    return state
}

function mergeOutcomeUpadates(state: Map<number, OutcomeEntity>, outcomes: OutcomeUpdate[]): Map<number, OutcomeEntity> {

    if (outcomes) {
        for (let outcome of outcomes) {
            const entity = state.get(outcome.id)
            if (entity) {
                state = state.set(outcome.id, {
                    ...entity,
                    ...outcome
                })
            }
        }
    }

    return state
}

function mergeEventRemoved(state: EntityStore, update: EventRemoved): Partial<EntityStore> {
    const eventEntity = state.events.get(update.eventId)

    if (eventEntity && eventEntity.betOffers) {
        const events = state.events.remove(update.eventId)
        let betoffers = state.betoffers
        let outcomes = state.outcomes

        for (let betOfferId of eventEntity.betOffers) {
            const bo = betoffers.get(betOfferId)
            if (bo) {
                betoffers = betoffers.remove(betOfferId)

                if (bo.outcomes) {
                    for (let outcomeId of bo.outcomes) {
                        outcomes = outcomes.remove(outcomeId)
                    }
                }
            }
        }

        return {
            events,
            betoffers,
            outcomes
        }
    }

    return state
}

function mergeBetOfferRemoved(state: EntityStore, update: BetOfferRemoved): Partial<EntityStore> {
    const betOfferEntity = state.betoffers.get(update.betOfferId)
    let betoffers = state.betoffers
    let events = state.events

    if (betOfferEntity) {
        betoffers = betoffers.remove(update.betOfferId)

        // remove betoffer from event as-well, ignore main for now...
        let event = events.get(betOfferEntity.eventId)
        if (event) {
            event = {
                ...event,
                betOffers: event.betOffers.filter(id => id !== update.betOfferId)
            }
            events = events.set(betOfferEntity.eventId, event)
        }
    }

    return {
        betoffers,
        events
    }
}

function mergeBetOfferAdded(state: EntityStore, update: BetOfferAdded): Partial<EntityStore> {
    const betOfferEntity = createBetOfferEntity(update.betOffer)
    let betoffers = state.betoffers.set(betOfferEntity.id, betOfferEntity)
    let events = state.events
    let outcomes = mergeOutcomes(state.outcomes, update.betOffer.outcomes)

    let event = state.events.get(betOfferEntity.eventId)
    if (event) {
        event = {
            ...event,
            betOffers: [...event.betOffers, betOfferEntity.id]
        }
        events = events.set(event.id, event)
    }

    return {
        betoffers,
        events,
        outcomes
    }
}

function mergeBetOfferStatusUpdate(state: EntityStore, update: BetOfferStatusUpdate): Map<number, BetOfferEntity> {
    let betoffers = state.betoffers

    const betOfferEntity = betoffers.get(update.betOfferId)

    if (betOfferEntity) {
        betoffers = betoffers.set(update.betOfferId, {...betOfferEntity, suspended: update.suspended})
    }

    return betoffers
}

function mergeSuspendAllBetOffers(state: EntityStore, update: AllBetOffersSuspended): Map<number, BetOfferEntity> {
    const event = state.events.get(update.eventId)
    let betoffers = state.betoffers

    if (event && event.betOffers) {

        for (let betOfferId of event.betOffers) {
            const bo = betoffers.get(betOfferId)
            if (bo && !bo.suspended) {
                betoffers = betoffers.set(betOfferId, {
                    ...bo,
                    suspended: true
                })
            }
        }
    }

    return betoffers
}



