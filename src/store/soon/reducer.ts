import {SOON_LOAD_FAILED, SOON_LOAD_SUCCESS, SOON_START_LOADING} from "./types"
import {SoonLoadAction} from "./actions"

export interface SoonEventsStore {
    soonEvents: number[]
    loading: boolean
}

const initialState: SoonEventsStore = {
    loading: false,
    soonEvents: []
}

export default function soonReducer(state: SoonEventsStore = initialState, action: SoonLoadAction): SoonEventsStore {
    switch (action.type) {
        case SOON_START_LOADING:
            return {
                ...state,
                loading: true
            }
        case SOON_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                soonEvents: action.data.events.map(liveEvent => liveEvent.event.id)
            }
        case SOON_LOAD_FAILED:
            return {
                ...state,
                loading: false,
                soonEvents: []
            }
        default:
            return state
    }
}