import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LiveLoadAction} from "store/live/actions"
import {LiveData} from "api/typings";
import {Map} from "immutable"

export interface StatsStore {
    liveData: Map<number, LiveData>
}

const initialState: StatsStore = {
    liveData: Map<number, LiveData>()
}

export default function statsReducer(state: StatsStore = initialState, action: LiveLoadAction): StatsStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                liveData: mergeLiveData(state.liveData, liveEvents.map(evt => evt.liveData))
            }
        default:
            return state
    }
}

function mergeLiveData(state: Map<number, LiveData>, events: LiveData[]): Map<number, LiveData> {
    for (let liveData of events) {
        // TODO: should merge in changes
        state = state.set(liveData.eventId, liveData);
    }

    return state
}
