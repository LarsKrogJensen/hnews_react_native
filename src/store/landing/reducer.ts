import {LandingActions, LandingLoadAction} from "./actions"
import {LandingPageSection} from "api/typings";
import {Range} from "api/typings";

export interface EventCollection {
    events: number[]
    range: Range
}

export interface LandingStore {
    liveRightNow: EventCollection
    popular: EventCollection
    highlights: EventCollection
    shocker: EventCollection
    nextOff: EventCollection
    startingSoon: EventCollection
    loading: boolean
}

const initialState: LandingStore = {
    loading: false,
    liveRightNow: {events: [], range: {}},
    popular: {events: [], range: {}},
    highlights: {events: [], range: {}},
    shocker: {events: [], range: {}},
    nextOff: {events: [], range: {}},
    startingSoon: {events: [], range: {}}
}

export default function landingReducer(state: LandingStore = initialState, action: LandingLoadAction): LandingStore {
    switch (action.type) {
        case LandingActions.START_LOADING:
            return {
                ...state,
                loading: true
            }
        case LandingActions.LOAD_SUCCESS:
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
        case LandingActions.LOAD_FAILED:
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}

function mapEvents(sectionName: string, sections: LandingPageSection[]): EventCollection {
    let section = sections.find(value => value.name === sectionName);
    if (section && section.events) {
        return {
            events: section.events.map(value => value.event.id),
            range: section.range || {}
        }
    }

    return { events: [], range: {}}

}