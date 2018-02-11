import * as React from "react"
import {ViewStyle} from "react-native";
import {FootballEventFeed} from "components/feed/FootballEventFeed";
import {TennisEventFeed} from "components/feed/TennisEventFeed";
import {GenericEventFeed} from "components/feed/GenericEventFeed";

interface Props {
    eventId: number
    eventGroupId: number
    sport: string
    style?: ViewStyle
}

export class EventLiveStatsView extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.eventGroupId !== this.props.eventGroupId) return true
        if (nextProps.sport !== this.props.sport) return true

        return false
    }

    public render() {
        const {sport, eventGroupId, eventId} = this.props

        let s = sport.toLowerCase();
        if (s === "football") {
            return <FootballEventFeed eventGroupId={eventGroupId} eventId={eventId}/>
        } else if (s === "tennis" || s === "volleyball") {
            return <TennisEventFeed eventGroupId={eventGroupId} eventId={eventId}/>
        }

        return <GenericEventFeed eventId={eventId}/>
    }
}
