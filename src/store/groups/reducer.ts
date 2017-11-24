import {
    GROUPS_LOAD_FAILED,
    GROUPS_LOAD_SUCCESS,
    GROUPS_START_LOADING,
    HIGHLIGHTS_LOAD_FAILED,
    HIGHLIGHTS_LOAD_SUCCESS,
    HIGHLIGHTS_START_LOADING
} from "./types"
import {Map} from "immutable"
import {GroupsLoadAction} from "./actions"
import {EventGroup} from "api/typings";


export interface GroupStore {
    groupsLoading: boolean
    highlightsLoading: boolean
    groupById: Map<number, EventGroup>
    sports: number[]
    highlights: number[]
}

const initialState: GroupStore = {
    groupsLoading: false,
    highlightsLoading: false,
    groupById: Map(),
    sports: [],
    highlights: []
}

export default function groupsReducer(state: GroupStore = initialState, action: GroupsLoadAction): GroupStore {
    switch (action.type) {
        case GROUPS_START_LOADING:
            return {
                ...state,
                groupsLoading: true
            }
        case GROUPS_LOAD_SUCCESS:
            return {
                ...state,
                groupsLoading: false,
                groupById: flattenGroups(undefined, action.data.group.groups || [], state.groupById),
                sports: (action.data.group.groups || []).map(group => group.id)
            }
        case GROUPS_LOAD_FAILED:
            return {
                ...state,
                groupsLoading: false
            }
        case HIGHLIGHTS_START_LOADING:
            return {
                ...state,
                highlightsLoading: true
            }
        case HIGHLIGHTS_LOAD_SUCCESS:
            return {
                ...state,
                highlights: action.data.groups.map(group => group.id),
                highlightsLoading: false

            }
        case HIGHLIGHTS_LOAD_FAILED:
            return {
                ...state,
                highlightsLoading: false
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
