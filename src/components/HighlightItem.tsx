import * as React from "react"
import {ComponentClass} from "react"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {Text, View} from "react-native";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import EventPathItem from "components/EventPathItem";
import * as moment from "moment";
import Touchable from "components/Touchable";

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
        const startTime = moment.utc(this.props.event.start).local()
        const now = moment.utc(moment.now())

        let datum = ""
        if (startTime.isSame(now, "d")) {
            datum = "Today"
        } else if (startTime.isAfter(now, "d")) {
            datum = "Tomorrow"
        } else {
            datum = startTime.format("yyyy:MM:dd")
        }
        return (
            <Touchable style={{paddingVertical: 8}} onPress={() => this.props.navigation.navigate("Event")}>
                <View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{color: "#333333", flex: 1}}>{event.homeName} - {event.awayName}</Text>
                        <Text style={{color: "#333333"}}>{datum}</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <EventPathItem event={event} style={{flex: 1}}/>
                        <Text style={{color: "#333333"}}>{startTime.format("HH:mm")}</Text>
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
