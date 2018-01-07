import {Map} from "immutable"
import {GroupsLoadAction} from "./actions"
import {EventGroup} from "api/typings";
import {GroupActions, HighlightActions} from "store/groups/actions";


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
