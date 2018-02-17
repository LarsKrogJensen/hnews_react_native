import {LiveAction, LiveActions} from "store/live/actions"
import {
    EventScoreUpdate, EventStats,
    EventWithBetOffers,
    H2HResponse,
    LeagueTable,
    LiveData,
    LiveFeedEvent,
    MatchClock,
    Occurence,
    Score,
    TPIResponse
} from "api/typings";
import {Map, Set} from "immutable"
import {LandingAction, LandingActions} from "store/landing/actions";
import * as _ from "lodash"
import {PushAction, PushActions} from "store/push/actions";
import {H2HActions, LeagueTableActions, LiveDataActions, StatsAction, TPIActions} from "store/stats/actions";

export interface StatsStore {
    liveDataLoading: Set<number>
    occurences: Map<number, Occurence[]>
    statistics: Map<number, EventStats>,
    scores: Map<number, Score>,
    liveFeeds: Map<number, LiveFeedEvent[]>
    leagueTable: Map<number, LeagueTable>
    leagueTableLoading: Set<number>
    h2h: Map<number, H2HResponse>
    h2hLoading: Set<number>
    tpi: Map<number, TPIResponse>
    tpiLoading: Set<number>
    matchClocks: Map<number, MatchClock>
}

const initialState: StatsStore = {
    statistics: Map(),
    scores: Map(),
    liveDataLoading: Set(),
    occurences: Map(),
    liveFeeds: Map(),
    leagueTable: Map(),
    leagueTableLoading: Set(),
    h2h: Map(),
    h2hLoading: Set(),
    tpi: Map(),
    tpiLoading: Set(),
    matchClocks: Map()
}

export function statsReducer(state: StatsStore = initialState, action: LiveAction | LandingAction | PushAction | StatsAction): StatsStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                ...state,
                ...mergeLiveData(state, liveEvents.map(evt => evt.liveData))
            }
        case LandingActions.LOAD_SUCCESS:
            const landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            const liveData = landingEvents.map(evt => evt.liveData).filter(ld => ld != undefined)

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
                ...mergeScore(state, action.data)
            }
        case PushActions.EVENT_STATS_UPDATE:
            return {
                ...state,
                statistics: state.statistics.set(action.data.eventId, action.data.statistics),
            }
        case PushActions.MATCH_CLOCK_UPDATED:
            return {
                ...state,
                matchClocks: state.matchClocks.set(action.data.eventId, action.data.matchClock)
            }
        case PushActions.MATCH_CLOCK_REMOVED:
            return {
                ...state,
                matchClocks: state.matchClocks.remove(action.data.eventId),
            }
        case PushActions.EVENT_REMOVED:
            return {
                ...state,
                matchClocks: state.matchClocks.remove(action.data.eventId),
                liveFeeds: state.liveFeeds.remove(action.data.eventId),
                leagueTable: state.leagueTable.remove(action.data.eventId),
                h2h: state.h2h.remove(action.data.eventId),
                tpi: state.tpi.remove(action.data.eventId),
                occurences: state.occurences.remove(action.data.eventId),
                statistics: state.statistics.remove(action.data.eventId),
                scores: state.scores.remove(action.data.eventId)
            }
        case PushActions.MATCH_OCCURENCE:
            return {
                ...state,
                occurences: mergeMatchOccurence(state.occurences, action.data)
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
    let {occurences, scores, matchClocks, statistics, liveFeeds} = state
    for (let item of items) {
        if (!item) continue
        if (item.occurrences) {
            occurences = occurences.set(item.eventId, item.occurrences)
        }
        if (item.liveFeedUpdates) {
            liveFeeds = liveFeeds.set(item.eventId, item.liveFeedUpdates)
        }
        if (item.matchClock) {
            matchClocks = matchClocks.set(item.eventId, item.matchClock)
        }
        if (item.statistics) {
            statistics = statistics.set(item.eventId, item.statistics)
        }
        if (item.score) {
            scores = scores.set(item.eventId, item.score)
        }
    }

    return {
        matchClocks,
        statistics,
        scores,
        occurences,
        liveFeeds
    }
}

function mergeScore(state: StatsStore, update: EventScoreUpdate): Partial<StatsStore> {
    let {scores, liveFeeds} = state

    scores = scores.set(update.eventId, update.score)

    const feed = liveFeeds.get(update.eventId) || []
    // Todo: check for duplicates, removal and updates?
    liveFeeds = liveFeeds.set(update.eventId, feed.concat({score: update.score, type: "SCORE"}))

    return {scores, liveFeeds}
}


function mergeMatchOccurence(state: Map<number, Occurence[]>, occurence: Occurence): Map<number, Occurence[]> {

    let occurences = state.get(occurence.eventId) || []
    occurences = [...occurences, occurence]
    return state.set(occurence.eventId, occurences)
}