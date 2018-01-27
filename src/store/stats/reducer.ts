import {LiveAction, LiveActions} from "store/live/actions"
import {
    EventScoreUpdate,
    EventStatsUpdate,
    EventWithBetOffers,
    LiveData,
    MatchClockRemoved,
    MatchClockUpdated
} from "api/typings";
import {Map} from "immutable"
import {LandingAction, LandingActions} from "store/landing/actions";
import * as _ from "lodash"
import {PushAction, PushActions} from "store/push/actions";

export interface StatsStore {
    liveData: Map<number, LiveData>
}

const initialState: StatsStore = {
    liveData: Map<number, LiveData>()
}

export default function statsReducer(state: StatsStore = initialState, action: LiveAction | LandingAction | PushAction): StatsStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                liveData: mergeLiveData(state.liveData, liveEvents.map(evt => evt.liveData))
            }
        case LandingActions.LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let liveData = landingEvents.map(evt => evt.liveData).filter(ld => ld != undefined)

            return {
                liveData: mergeLiveData(state.liveData, liveData)
            }
        case PushActions.EVENT_SCORE_UPDATE:
            return {
                liveData: mergeScore(state.liveData, action.data),
            }
        case PushActions.EVENT_STATS_UPDATE:
            return {
                liveData: mergeEventStats(state.liveData, action.data),
            }
        case PushActions.MATCH_CLOCK_UPDATED:
            return {
                liveData: mergeMatchClockUpdate(state.liveData, action.data),
            }
        case PushActions.MATCH_CLOCK_REMOVED:
            return {
                liveData: mergeMatchClockRemoved(state.liveData, action.data),
            }
        case PushActions.EVENT_REMOVED:
            return {
                liveData: state.liveData.remove(action.data.eventId),
            }
        default:
            return state
    }
}

function mergeLiveData(state: Map<number, LiveData>, liveDataList: (LiveData | undefined)[]): Map<number, LiveData> {
    for (let liveData of liveDataList) {
        // TODO: should merge in changes
        if (!liveData) continue

        state = state.set(liveData.eventId, liveData);
    }

    return state
}

function mergeScore(state: Map<number, LiveData>, update: EventScoreUpdate): Map<number, LiveData> {

    const liveData: LiveData = state.get(update.eventId)
    if (liveData) {
        return state.set(update.eventId, {
            ...liveData,
            score: update.score
        })
    }

    return state
}

function mergeEventStats(state: Map<number, LiveData>, update: EventStatsUpdate): Map<number, LiveData> {

    const liveData: LiveData = state.get(update.eventId)
    if (liveData) {
        return state.set(update.eventId, {
            ...liveData,
            statistics: update.statistics
        })
    }

    return state
}

function mergeMatchClockUpdate(state: Map<number, LiveData>, update: MatchClockUpdated): Map<number, LiveData> {

    const liveData: LiveData = state.get(update.eventId)
    if (liveData) {
        return state.set(update.eventId, {
            ...liveData,
            matchClock: update.matchClock
        })
    }

    return state
}

function mergeMatchClockRemoved(state: Map<number, LiveData>, update: MatchClockRemoved): Map<number, LiveData> {

    const liveData: LiveData = state.get(update.eventId)
    if (liveData) {
        return state.set(update.eventId, {
            ...liveData,
            matchClock: undefined
        })
    }

    return state
}
