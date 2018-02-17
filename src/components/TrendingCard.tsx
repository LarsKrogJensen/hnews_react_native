import * as React from "react"
import {ComponentClass} from "react"
import {Card} from "components/Card";
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {EventPathItem} from "components/event/EventPathItem";
import {formatDateTime} from "lib/dates";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {navigate} from "lib/navigate";

interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event?: EventEntity
}

type Props = StateProps & ExternalProps

class TrendingCardComponent extends React.Component<Props> {
    public render() {
        const {event, navigation} = this.props
        if (!event) return null
        return (
            <Card onPress={() => navigate(this.props.navigation, "Event", {eventId: this.props.eventId})}>
                <View>
                    {this.renderHeader(event)}
                    {this.renderBody(event, navigation)}
                </View>
            </Card>
        )
    }

    private renderHeader(event: EventEntity) {
        const {date, time} = formatDateTime(event.start)
        return (
            <View style={styles.header}>
                <Text style={styles.headerTitle}>TRENDING</Text>
                <Text>{`${date} ${time}`}</Text>
            </View>
        )
    }

    private renderBody(event: EventEntity, navigation: NavigationScreenProp<{}, {}>) {
        return (
            <View style={styles.body}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <EventPathItem path={event.path} style={{marginBottom: 8, marginTop: 4, alignSelf: "center"}}/>
                {event.mainBetOfferId &&
                <DefaultBetOfferItem betofferId={event.mainBetOfferId} navigation={navigation}/>}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#F6F6F6"
    } as ViewStyle,
    header: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.12)"
    } as ViewStyle,
    headerTitle: {
        fontWeight: "500",
        flex: 1,
        color: "#333333"
    } as TextStyle,
    eventTitle: {
        fontSize: 20,
        marginTop: 8,
        textAlign: "center"
    } as TextStyle,
    body: {
        padding: 8,
        justifyContent: "center",
        alignItems: "stretch"
    } as ViewStyle
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const TrendingCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(TrendingCardComponent)
