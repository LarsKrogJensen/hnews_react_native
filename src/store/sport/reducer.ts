import {SPORT_LOAD_FAILED, SPORT_LOAD_SUCCESS, SPORT_START_LOADING} from "./types"
import {SportLoadAction} from "./actions"
import {Map} from "immutable"

export interface SportEventsStore {
    events: Map<String, number[]>
    loading: Map<String, boolean>
}

const initialState: SportEventsStore = {
    events: Map(),
    loading: Map()
}

export default function soonReducer(state: SportEventsStore = initialState, action: SportLoadAction): SportEventsStore {
    switch (action.type) {
        case SPORT_START_LOADING:
            return {
                events: state.events,
                loading: state.loading.set(action.key, false)
            }
        case SPORT_LOAD_SUCCESS:
            return {
                events: state.events.set(action.key, action.data.events.map(liveEvent => liveEvent.event.id)),
                loading: state.loading.set(action.key, false)
            }
        case SPORT_LOAD_FAILED:
            return {
                events: state.events,
                loading: state.loading.set(action.key, false)
            }
        default:
            return state
    }
}