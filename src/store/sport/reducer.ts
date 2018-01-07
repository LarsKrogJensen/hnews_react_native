import {SportActions, SportLoadAction} from "./actions"
import {Map, Set} from "immutable"

export interface SportEventsStore {
    events: Map<String, number[]>
    loading: Set<String>
}

const initialState: SportEventsStore = {
    events: Map(),
    loading: Set()
}

export default function sportReducer(state: SportEventsStore = initialState, action: SportLoadAction): SportEventsStore {
    switch (action.type) {
        case SportActions.START_LOADING:
            return {
                events: state.events,
                loading: state.loading.add(action.key)
            }
        case SportActions.LOAD_SUCCESS:
            return {
                events: state.events.set(action.key, action.data.events.map(liveEvent => liveEvent.event.id)),
                loading: state.loading.remove(action.key)
            }
        case SportActions.LOAD_FAILED:
            return {
                events: state.events,
                loading: state.loading.remove(action.key)
            }
        default:
            return state
    }
}