import * as React from "react"
import {ComponentClass} from "react"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {Text, View} from "react-native";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import EventPathItem from "components/EventPathItem";
import Touchable from "components/Touchable";
import {formatDateTime} from "lib/dates";
import {navigate} from "lib/navigate";

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

        const {date, time} = formatDateTime(event.start)
        return (
            <Touchable style={{paddingVertical: 8}}
                       onPress={() => navigate(this.props.navigation, "Event", {eventId: this.props.eventId})}>
                <View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: "#333333", flex: 1}}>{event.homeName} - {event.awayName}</Text>
                        <Text style={{color: "#333333"}}>{date}</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <EventPathItem path={event.path} style={{flex: 1}}/>
                        <Text style={{color: "#333333"}}>{time}</Text>
                    </View>
                </View>
            </Touchable>
        )
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const HighlightItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(HighlightItemComponent)
