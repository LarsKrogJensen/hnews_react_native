import {LiveActions, LiveAction} from "store/live/actions"
import {EventWithBetOffers, LiveData} from "api/typings";
import {Map} from "immutable"
import {LandingActions, LandingAction} from "store/landing/actions";
import * as _ from "lodash"

export interface StatsStore {
    liveData: Map<number, LiveData>
}

const initialState: StatsStore = {
    liveData: Map<number, LiveData>()
}

export default function statsReducer(state: StatsStore = initialState, action: LiveAction | LandingAction): StatsStore {
    switch (action.type) {
        case LiveActions.LOAD_SUCCESS:
            const liveEvents = action.data.liveEvents;
            return {
                liveData: mergeLiveData(state.liveData, liveEvents.map(evt => evt.liveData))
            }
        case LandingActions.LOAD_SUCCESS:
            let landingEvents: EventWithBetOffers[] = _.flatMap(action.data.result.map(section => section.events)).filter(e => e)
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
