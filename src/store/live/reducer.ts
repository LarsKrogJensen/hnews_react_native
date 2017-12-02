import {LIVE_LOAD_FAILED, LIVE_LOAD_SUCCESS, LIVE_START_LOADING} from "./types"
import {LiveLoadAction} from "./actions"
import {EventGroup} from "api/typings";

export interface LiveEventsStore {
    liveEvents: number[]
    groups: EventGroup[]
    loading: boolean
}

const initialState: LiveEventsStore = {
    loading: false,
    liveEvents: [],
    groups: []
}

export default function liveReducer(state: LiveEventsStore = initialState, action: LiveLoadAction): LiveEventsStore {
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
                liveEvents: action.data.liveEvents.map(liveEvent => liveEvent.event.id),
                groups: action.data.group.groups || []
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