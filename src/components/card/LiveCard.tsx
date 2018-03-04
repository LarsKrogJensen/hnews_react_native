import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {MatchClockItem} from "components/MatchClockItem";
import {Card} from "components/card/Card";
import {EventPathItem} from "components/event/EventPathItem";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {LiveCardScore} from "components/card/LiveCardScore";
import {navigate} from "lib/navigate";
import deepEqual from "deep-equal";
import {objectPropEquals} from "lib/equallity";


interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}>,
}

interface StateProps {
    event?: EventEntity,
}

type Props = StateProps & ExternalProps

class LiveCardComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (!objectPropEquals(nextProps.event, this.props.event, e => e!.mainBetOfferId)) return true

        return false
    }

    public render() {
        const {event, navigation} = this.props
        if (!event) {
            return null
        }

        return (
            <Card onPress={this.handleClick}>
                <View>
                    {this.renderHeader(event)}
                    {this.renderBody(event, navigation)}
                </View>
            </Card>
        )
    }

    private renderHeader = (event: EventEntity) => {
        return (
            <View style={styles.header}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.liveText}>Live</Text>
                <EventPathItem
                    path={event.path}
                    style={{flex: 1}}
                    textStyle={{fontSize: 16, color: "#717171"}}
                />
                <MatchClockItem eventId={event.id}/>
            </View>
        )
    }

    private renderBody = (event, navigation) => {

        return (
            <View style={styles.body}>
                <LiveCardScore eventId={event.id} navigation={navigation}/>
                {event.mainBetOfferId &&
                <DefaultBetOfferItem betofferId={event.mainBetOfferId} navigation={navigation}/>}
            </View>
        )
    }

    private handleClick = () => {
        navigate(this.props.navigation, "Event", {eventId: this.props.eventId})
    }
}

const styles = StyleSheet.create({
        liveText: {
            color: "red",
            fontSize: 16,
            marginRight: 8,
            fontWeight: "bold"
        } as TextStyle,
        header: {
            flexDirection: "row",
            padding: 8,
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0, 0, 0, 0.12)"
        } as ViewStyle,
        body: {
            padding: 8,
            justifyContent: "flex-start",
            alignItems: "stretch"
        } as ViewStyle
    }
)

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
})

export const LiveCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveCardComponent)
