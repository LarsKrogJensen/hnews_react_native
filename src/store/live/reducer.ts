import {LiveLoadAction, LiveActions} from "./actions"
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
        case LiveActions.START_LOADING:
            return {
                ...state,
                loading: true
            }
        case LiveActions.LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                liveEvents: action.data.liveEvents.map(liveEvent => liveEvent.event.id),
                groups: action.data.group.groups || []
            }
        case LiveActions.LOAD_FAILED:
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