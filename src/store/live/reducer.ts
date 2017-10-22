import {LIVE_LOAD_FAILED, LIVE_LOAD_SUCCESS, LIVE_START_LOADING} from "./types"
import {LiveLoadAction} from "./actions"
import {EventGroup, LiveEvent} from "api/typings";

export interface LiveEventsState {
    liveEvents: LiveEvent[]
    groups: EventGroup[]
    loading: boolean
}

const initialState: LiveEventsState = {
    loading: false,
    liveEvents: [],
    groups: []
}

export default function liveReducer(state: LiveEventsState = initialState, action: LiveLoadAction): LiveEventsState {
    switch (action.type) {
        case LIVE_START_LOADING:
            return {
                ...state,
                loading: true
            }
        case LIVE_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                liveEvents: action.data.liveEvents,
                groups: action.data.group.groups
            }
        case LIVE_LOAD_FAILED:
            return {
                ...state,
                loading: false,
                liveEvents: [],
                groups: []
            }
        default:
            return state
    }
}