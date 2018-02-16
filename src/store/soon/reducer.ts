import {SoonActions, SoonAction} from "./actions"

export interface SoonEventsStore {
    soonEvents: number[]
    loading: boolean
}

const initialState: SoonEventsStore = {
    loading: false,
    soonEvents: []
}

export function soonReducer(state: SoonEventsStore = initialState, action: SoonAction): SoonEventsStore {
    switch (action.type) {
        case SoonActions.START_LOADING:
            return {
                ...state,
                loading: true
            }
        case SoonActions.LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                soonEvents: action.data.events.map(liveEvent => liveEvent.event.id)
            }
        case SoonActions.LOAD_FAILED:
            return {
                ...state,
                loading: false,
                soonEvents: []
            }
        default:
            return state
    }
}