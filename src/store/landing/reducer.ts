import {LANDING_LOAD_FAILED, LANDING_LOAD_SUCCESS, LANDING_START_LOADING} from "./types"
import {LandingLoadAction} from "./actions"
import {LandingPageSection} from "api/typings";

export interface LandingStore {
    liveRightNow: number[]
    popular: number[]
    highlights: number[]
    shocker: number[]
    nextOff: number[]
    startingSoon: number[]
    loading: boolean
}

const initialState: LandingStore = {
    loading: false,
    liveRightNow: [],
    popular: [],
    highlights: [],
    shocker: [],
    nextOff: [],
    startingSoon: []
}

export default function landingReducer(state: LandingStore = initialState, action: LandingLoadAction): LandingStore {
    switch (action.type) {
        case LANDING_START_LOADING:
            return {
                ...state,
                loading: true
            }
        case LANDING_LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                liveRightNow: mapEvents("LRN", action.data.result),
                popular: mapEvents("popular", action.data.result),
                highlights: mapEvents("highlights", action.data.result),
                shocker: mapEvents("shocker", action.data.result),
                nextOff: mapEvents("nextoff", action.data.result),
                startingSoon: mapEvents("startingsoon", action.data.result)
            }
        case LANDING_LOAD_FAILED:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}

function mapEvents(sectionName: string, sections: LandingPageSection[]): number[] {
    let section = sections.find(value => value.name === sectionName);
    if (section && section.events) {
        return section.events.map(value => value.event.id)
    }

    return []

}