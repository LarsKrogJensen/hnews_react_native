import {LiveAction, LiveActions} from "store/live/actions"
import {
    EventScoreUpdate,
    EventStatsUpdate,
    EventWithBetOffers,
    H2HResponse,
    LeagueTable,
    LiveData,
    LiveFeedEvent,
    MatchClockRemoved,
    MatchClockUpdated,
    Occurence,
    TPIResponse
} from "api/typings";
import {Map, Set} from "immutable"
import {LandingAction, LandingActions} from "store/landing/actions";
import * as _ from "lodash"
import {PushAction, PushActions} from "store/push/actions";
import {H2HActions, LeagueTableActions, LiveDataActions, StatsAction, TPIActions} from "store/stats/actions";

export interface StatsStore {
    liveData: Map<number, LiveData>
    liveDataLoading: Set<number>
    occurences: Map<number, Occurence[]>
    liveFeed: Map<number, LiveFeedEvent[]>
    leagueTable: Map<number, LeagueTable>
    leagueTableLoading: Set<number>
    h2h: Map<number, H2HResponse>
    h2hLoading: Set<number>
    tpi: Map<number, TPIResponse>
    tpiLoading: Set<number>
}

const initialState: StatsStore = {
    liveData: Map(),
    liveDataLoading: Set(),
    occurences: Map(),
    liveFeed: Map(),
    leagueTable: Map(),
    leagueTableLoading: Set(),
    h2h: Map(),
    h2hLoading: Set(),
    tpi: Map(),
    tpiLoading: Set(),
}

export default function statsReducer(state: StatsStore = initialState, action: LiveAction | LandingAction | PushAction | StatsAction): StatsStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                ...state,
                ...mergeLiveData(state, liveEvents.map(evt => evt.liveData))
            }
        case LandingActions.LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let liveData = landingEvents.map(evt => evt.liveData).filter(ld => ld != undefined)

            return {
                ...state,
                ...mergeLiveData(state, liveData)
            }
        case LiveDataActions.START_LOADING:
            return {
                ...state,
                liveDataLoading: state.liveDataLoading.add(action.eventId)
            }
        case LiveDataActions.LOAD_SUCCESS:
            return {
                ...state,
                ...mergeLiveData(state, [action.data]),
                liveDataLoading: state.liveDataLoading.remove(action.eventId)
            }
        case LiveDataActions.LOAD_FAILED:
            return {
                ...state,
                liveDataLoading: state.liveDataLoading.remove(action.eventId)
            }
        case PushActions.EVENT_SCORE_UPDATE:
            return {
                ...state,
                ...mergeScore(state, action.data),
            }
        case PushActions.EVENT_STATS_UPDATE:
            return {
                ...state,
                liveData: mergeEventStats(state.liveData, action.data),
            }
        case PushActions.MATCH_CLOCK_UPDATED:
            return {
                ...state,
                liveData: mergeMatchClockUpdate(state.liveData, action.data),
            }
        case PushActions.MATCH_CLOCK_REMOVED:
            return {
                ...state,
                liveData: mergeMatchClockRemoved(state.liveData, action.data),
            }
        case PushActions.EVENT_REMOVED:
            return {
                ...state,
                liveData: state.liveData.remove(action.data.eventId),
                occurences: state.occurences.remove(action.data.eventId)
            }
        case LeagueTableActions.START_LOADING:
            return {
                ...state,
                leagueTableLoading: state.leagueTableLoading.add(action.eventGroupId)
            }
        case LeagueTableActions.LOAD_SUCCESS:
            return {
                ...state,
                leagueTable: state.leagueTable.set(action.eventGroupId, action.data),
                leagueTableLoading: state.leagueTableLoading.remove(action.eventGroupId)
            }
        case LeagueTableActions.LOAD_FAILED:
            return {
                ...state,
                leagueTableLoading: state.leagueTableLoading.remove(action.eventGroupId)
            }
        case H2HActions.START_LOADING:
            return {
                ...state,
                h2hLoading: state.h2hLoading.add(action.eventId)
            }
        case H2HActions.LOAD_SUCCESS:
            return {
                ...state,
                h2h: state.h2h.set(action.eventId, action.data),
                h2hLoading: state.h2hLoading.remove(action.eventId)
            }
        case H2HActions.LOAD_FAILED:
            return {
                ...state,
                h2hLoading: state.h2hLoading.remove(action.eventId)
            }
        case TPIActions.START_LOADING:
            return {
                ...state,
                tpiLoading: state.tpiLoading.add(action.eventId)
            }
        case TPIActions.LOAD_SUCCESS:
            return {
                ...state,
                tpi: state.tpi.set(action.eventId, action.data),
                tpiLoading: state.tpiLoading.remove(action.eventId)
            }
        case TPIActions.LOAD_FAILED:
            return {
                ...state,
                tpiLoading: state.tpiLoading.remove(action.eventId)
            }
        default:
            return state
    }
}

function mergeLiveData(state: StatsStore, items: (LiveData | undefined)[]): Partial<StatsStore> {
    let liveData = state.liveData
    let occurences = state.occurences
    let liveFeed = state.liveFeed
    for (let item of items) {
        if (!item) continue
        liveData = liveData.set(item.eventId, item);
        if (item.occurrences) {
            occurences = occurences.set(item.eventId, item.occurrences)
        }
        if (item.liveFeedUpdates) {
            liveFeed = liveFeed.set(item.eventId, item.liveFeedUpdates)
        }
    }

    return {
        liveData,
        occurences,
        liveFeed
    }
}

function mergeScore(state: StatsStore, update: EventScoreUpdate): Partial<StatsStore> {

    let liveData: Map<number, LiveData> = state.liveData
    let liveFeed: Map<number, LiveFeedEvent[]> = state.liveFeed

    const ld = liveData.get(update.eventId)
    if (liveData) {
        liveData = liveData.set(update.eventId, {
            ...ld,
            score: update.score
        })
    }

    const feed = liveFeed.get(update.eventId) || []
    liveFeed = liveFeed.set(update.eventId, feed.concat({score: update.score, type: "SCORE"}))

    return {liveData, liveFeed}
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
