import {LIVE_LOAD_SUCCESS} from "store/live/types"
import {LiveLoadAction} from "store/live/actions"
import {LandingEvent, LiveData} from "api/typings";
import {Map} from "immutable"
import {LANDING_LOAD_SUCCESS} from "store/landing/types";
import {LandingLoadAction} from "store/landing/actions";
import * as _ from "lodash"

export interface StatsStore {
    liveData: Map<number, LiveData>
}

const initialState: StatsStore = {
    liveData: Map<number, LiveData>()
}

export default function statsReducer(state: StatsStore = initialState, action: LiveLoadAction | LandingLoadAction): StatsStore {
    switch (action.type) {
        case LIVE_LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                liveData: mergeLiveData(state.liveData, liveEvents.map(evt => evt.liveData))
            }
        case LANDING_LOAD_SUCCESS:
            let landingEvents: LandingEvent[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
            let liveData = landingEvents.map(evt => evt.liveData).filter(ld => ld != undefined)

            return {
                liveData: mergeLiveData(state.liveData, liveData)
            }
        default:
            return state
    }
}

function mergeLiveData(state: Map<number, LiveData>, events: (LiveData | undefined)[]): Map<number, LiveData> {
    for (let liveData of events) {
        // TODO: should merge in changes
        if (!liveData) continue
        
        state = state.set(liveData.eventId, liveData);
    }

    return state
}
