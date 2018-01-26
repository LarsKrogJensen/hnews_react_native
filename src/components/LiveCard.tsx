import * as React from "react"
import {ComponentClass} from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {Orientation} from "lib/device";
import {LiveData} from "api/typings";
import MatchClockItem from "components/MatchClockItem";
import {CircularProgress} from 'react-native-circular-progress';
import {Card} from "components/Card";
import EventPathItem from "components/EventPathItem";
import {renderServe, renderTeamColors} from "components/RenderUtils";
import {DefaultBetOfferItem} from "components/betOffers/DefaultBetOfferItem";
import {LiveCardScore, LiveCardScoreComponent} from "components/LiveCardScore";


interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event: EventEntity,
    liveData: LiveData
}

type Props = StateProps & ExternalProps

class LiveCardComponent extends React.Component<Props> {
    public render() {
        return (
            <Card onPress={() => this.props.navigation.navigate("Event", {eventId: this.props.eventId})}>
                <View>
                    {this.renderHeader()}
                    {this.renderBody()}
                </View>
            </Card>
        )
    }

    private renderHeader() {
        const {event, liveData} = this.props
        return (
            <View style={headerStyle}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={liveTextStyle}>Live</Text>
                <EventPathItem
                    path={event.path}
                    style={{flex: 1}}
                    textStyle={{fontSize: 16, color: "#717171"}}
                />
                {liveData && <MatchClockItem matchClock={liveData.matchClock}/>}
            </View>
        )
    }

    private renderBody() {
        const {eventId, navigation, event} = this.props;

        return (
            <View style={bodyStyle}>
                <LiveCardScore eventId={eventId} navigation={navigation}/>
                {event.mainBetOfferId && <DefaultBetOfferItem betofferId={event.mainBetOfferId}/>}
            </View>
        )
    }
}

const liveTextStyle: TextStyle = {
    color: "red",
    fontSize: 16,
    marginRight: 8,
    fontWeight: "bold"
}

const headerStyle: ViewStyle = {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.12)"
}

const bodyStyle: ViewStyle = {
    padding: 8,
    justifyContent: "flex-start",
    alignItems: "stretch"
}


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId)
})

const LiveCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveCardComponent)

export default LiveCard