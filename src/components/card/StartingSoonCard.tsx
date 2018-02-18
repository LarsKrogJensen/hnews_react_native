import * as React from "react"
import {ComponentClass} from "react"
import {Card} from "components/card/Card";
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {EventPathItem} from "components/event/EventPathItem";
import CountDown from "components/CountDown";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {navigate} from "lib/navigate";
import {objectPropEquals} from "lib/equallity";

interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event?: EventEntity
}

type Props = StateProps & ExternalProps

class StartingSoonCardComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (!objectPropEquals(nextProps.event, this.props.event, e => e!.mainBetOfferId)) return true

        return false
    }


    public render() {
        const {event, navigation} = this.props
        if (!event) return null

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
                <Text style={styles.headerText}>STARTING SOON</Text>
                <CountDown start={event.start} format="HH:mm:ss"/>
            </View>
        )
    }

    private renderBody = (event: EventEntity, navigation: NavigationScreenProp<{}, {}>) => {
        return (
            <View style={styles.body}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <EventPathItem path={event.path} style={styles.path}/>
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
    card: {
        backgroundColor: "#F6F6F6"
    } as  ViewStyle,
    header: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.12)"
    } as ViewStyle,
    headerText: {
        fontWeight: "500",
        flex: 1,
        color: "#333333"
    } as TextStyle,
    body: {
        padding: 8,
        justifyContent: "center",
        alignItems: "stretch"
    } as ViewStyle,
    path: {
        marginBottom: 8,
        marginTop: 4,
        alignSelf: "center"
    } as ViewStyle,
    eventTitle: {
        fontSize: 20,
        marginTop: 8,
        textAlign: "center"
    } as TextStyle
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const StartingSoonCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(StartingSoonCardComponent)

