import * as React from "react"
import {ComponentClass} from "react"
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {EventEntity} from "entity/EventEntity";
import {Text, View, ViewStyle} from "react-native";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {formatDateTime} from "lib/dates";
import * as moment from "moment";

interface ExternalProps {
    eventId: number
    style?: ViewStyle
}

interface StateProps {
    event?: EventEntity
}

type ComponentProps = StateProps & ExternalProps & OrientationProps

class GenericEventFeedComponent extends React.Component<ComponentProps> {

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.event !== this.props.event) return true

        return false
    }

    render(): React.ReactNode {
        const {style, event} = this.props

        if (!event) {
            return <Text>Event not found</Text>
        }

        const startTime = moment.utc(event.start).local()
        const now = moment.utc(moment.now())
        let dateTime = formatDateTime(event.start);

        return (
            <View style={[style, {flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: 8}]}>
                <Text style={{fontWeight: "bold", fontSize: 16}}>{now > startTime ? "Match started" : "Match starts"}</Text>
                <Text style={{fontSize: 16}}>{dateTime.date} {dateTime.time}</Text>
            </View>
        )
    }
}

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const GenericEventFeed: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(withOrientationChange(GenericEventFeedComponent))

