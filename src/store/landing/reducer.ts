import {LandingAction, LandingActions} from "./actions"
import {LandingPageSection, Range} from "api/typings";
import {PushAction, PushActions} from "store/push/actions";

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

export function landingReducer(state: LandingStore = initialState, action: LandingAction | PushAction): LandingStore {
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
        case PushActions.EVENT_REMOVED:
            return {
                loading: state.loading,
                liveRightNow: removeEventFrom(state.liveRightNow, action.data.eventId),
                popular: removeEventFrom(state.popular, action.data.eventId),
                highlights: removeEventFrom(state.highlights, action.data.eventId),
                shocker: removeEventFrom(state.shocker, action.data.eventId),
                nextOff: removeEventFrom(state.nextOff, action.data.eventId),
                startingSoon: removeEventFrom(state.startingSoon, action.data.eventId),
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

    return {events: [], range: {}}
}

function removeEventFrom(events: EventCollection, eventId: number): EventCollection {
    return {
        events: events.events.filter(id => id !== eventId),
        range: events.range
    }
}