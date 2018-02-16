import {LiveAction, LiveActions} from "./actions"
import {EventGroup} from "api/typings";
import {PushAction, PushActions} from "store/push/actions";

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

export function liveReducer(state: LiveEventsStore = initialState, action: LiveAction | PushAction): LiveEventsStore {
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
        case PushActions.EVENT_REMOVED:
            return {
                ...state,
                liveEvents: state.liveEvents.filter(eventId => eventId !== action.data.eventId)
            }

        default:
            return state
    }
}