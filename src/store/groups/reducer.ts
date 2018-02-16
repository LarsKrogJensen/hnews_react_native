import {Map, Set} from "immutable"
import {GroupsLoadAction} from "./actions"
import {BetOfferCategory, EventGroup} from "api/typings";
import {
    BetOfferCategoryActions, GroupActions, HighlightActions, HighlightsLoadAction,
    PrematchCategoryLoadAction
} from "store/groups/actions";

export interface GroupStore {
    groupsLoading: boolean
    highlightsLoading: boolean
    groupById: Map<number, EventGroup>
    sports: number[]
    highlights: number[]
    betOfferCategories: Map<string, BetOfferCategory[]>
    loadingBetOfferCategories: Set<string>
}

const initialState: GroupStore = {
    groupsLoading: false,
    highlightsLoading: false,
    groupById: Map(),
    sports: [],
    highlights: [],
    betOfferCategories: Map(),
    loadingBetOfferCategories: Set()
}

export function groupsReducer(state: GroupStore = initialState, action: GroupsLoadAction | HighlightsLoadAction | PrematchCategoryLoadAction): GroupStore {
    switch (action.type) {
        case GroupActions.START_LOADING:
            return {
                ...state,
                groupsLoading: true
            }
        case GroupActions.LOAD_SUCCESS:
            return {
                ...state,
                groupsLoading: false,
                groupById: flattenGroups(undefined, action.data.group.groups || [], state.groupById),
                sports: (action.data.group.groups || []).map(group => group.id)
            }
        case GroupActions.LOAD_FAILED:
            return {
                ...state,
                groupsLoading: false
            }
        case HighlightActions.START_LOADING:
            return {
                ...state,
                highlightsLoading: true
            }
        case HighlightActions.LOAD_SUCCESS:
            return {
                ...state,
                highlights: action.data.groups.map(group => group.id),
                highlightsLoading: false

            }
        case HighlightActions.LOAD_FAILED:
            return {
                ...state,
                highlightsLoading: false
            }

        case BetOfferCategoryActions.START_LOADING: {
            const key = `${action.categoryName}-${action.eventGroupId}`
            return {
                ...state,
                loadingBetOfferCategories: state.loadingBetOfferCategories.add(key)
            }
        }
        case BetOfferCategoryActions.LOAD_SUCCESS: {
            const key = `${action.categoryName}-${action.eventGroupId}`
            return {
                ...state,
                betOfferCategories: state.betOfferCategories.set(key, action.data.categories),
                loadingBetOfferCategories: state.loadingBetOfferCategories.remove(key)

            }
        }
        case BetOfferCategoryActions.LOAD_FAILED: {
            const key = `${action.categoryName}-${action.eventGroupId}`

            return {
                ...state,
                loadingBetOfferCategories: state.loadingBetOfferCategories.remove(key)
            }
        }
        default:
            return state
    }
}

function flattenGroups(parent: EventGroup | undefined, data: EventGroup[], map: Map<number, EventGroup>): Map<number, EventGroup> {
    for (let eventGroup of data) {
        eventGroup.parentGroup = parent
        map = map.set(eventGroup.id, eventGroup)
        map = flattenGroups(eventGroup, eventGroup.groups || [], map)
    }

    return map
}
