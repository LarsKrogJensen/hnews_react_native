import * as React from "react"
import {ComponentClass} from "react"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {Text, View} from "react-native";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import EventPathItem from "components/EventPathItem";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>,
    eventId: number
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class HighlightItemComponent extends React.Component<Props> {

    public render() {
        const {event} = this.props
        return (
            <View>
                <Text style={{color: "#333333"}}>{event.homeName} - {event.awayName}</Text>
                <EventPathItem event={event} />
            </View>
        )
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const HighlightItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(HighlightItemComponent)
