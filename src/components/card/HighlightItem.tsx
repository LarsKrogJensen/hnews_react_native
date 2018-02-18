import * as React from "react"
import {ComponentClass} from "react"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {StyleSheet, Text, TextStyle, View} from "react-native";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {EventPathItem} from "components/event/EventPathItem";
import Touchable from "components/Touchable";
import {formatDateTime} from "lib/dates";
import {navigate} from "lib/navigate";
import {objectPropEquals} from "lib/compareProp";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>,
    eventId: number
}

interface StateProps {
    event?: EventEntity
}

type Props = StateProps & ExternalProps

class HighlightItemComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (!objectPropEquals(nextProps.event, this.props.event, e => e!.start)) return true

        return false
    }

    public render() {
        const {event} = this.props

        if (!event) return  null

        const {date, time} = formatDateTime(event.start)
        return (
            <Touchable style={{paddingVertical: 8}}
                       onPress={this.handleClick}>
                <View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.teams}>{event.homeName} - {event.awayName}</Text>
                        <Text style={styles.time}>{date}</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <EventPathItem path={event.path} style={{flex: 1}}/>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </View>
            </Touchable>
        )
    }

    private handleClick = () => {
        navigate(this.props.navigation, "Event", {eventId: this.props.eventId})
    }
}

const styles = StyleSheet.create({
    time: {color: "#333333"} as TextStyle,
    teams: {color: "#333333", flex: 1} as TextStyle,

})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const HighlightItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(HighlightItemComponent)
