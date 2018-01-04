import * as React from "react"
import {ComponentClass} from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import BetOfferItem from "components/BetOfferItem"
import {Orientation} from "lib/device";
import {LiveData} from "api/typings";
import MatchClockItem from "components/MatchClockItem";
import {CircularProgress} from 'react-native-circular-progress';
import {Card} from "components/Card";
import EventPathItem from "components/EventPathItem";
import {renderServe, renderTeamColors} from "components/RenderUtils";


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
            <Card onPress={() => this.props.navigation.navigate("Event")}>
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
                <Text style={liveTextStyle}>Live</Text>
                <EventPathItem
                    event={event}
                    style={{flex: 1}}
                    textStyle={{fontSize: 16, color: "#717171"}}
                />
                {liveData && <MatchClockItem matchClock={liveData.matchClock}/>}
            </View>
        )
    }

    private renderBody() {
        const {event} = this.props;

        return (
            <View style={bodyStyle}>
                {this.renderTeams()}
                <BetOfferItem orientation={Orientation.Portrait} betofferId={event.mainBetOfferId}/>
            </View>
        )
    }

    private renderTeams() {
        const {event, liveData} = this.props;

        const teamRowStyle: ViewStyle = {
            flexDirection: "row",
            alignItems: "center"
        }

        const textStyle: TextStyle = {fontSize: 20, flex: 1, marginLeft: 8}

        return (
            <View style={{flexDirection: "row", marginRight: 8}}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <View style={teamRowStyle}>
                        {renderTeamColors(event.teamColors && event.teamColors.home)}
                        <Text style={textStyle}>{event.homeName}</Text>
                        {renderServe(liveData, true)}
                    </View>
                    <View style={{...teamRowStyle, marginBottom: 8}}>
                        {renderTeamColors(event.teamColors && event.teamColors.away)}
                        <Text style={textStyle}>{event.awayName}</Text>
                        {renderServe(liveData, false)}
                    </View>
                </View>
                {this.renderScoreColumns(liveData)}
            </View>
        )
    }

    private renderScoreColumns(liveData: LiveData) {
        const {statistics: stats, score} = liveData

        if (stats && stats.sets && score) {
            const elements: JSX.Element[] = []

            const homeSets = stats.sets.home;
            const awaySets = stats.sets.away;

            for (let i = 0; i < homeSets.length; i++) {
                const home = homeSets[i];
                const away = awaySets[i];

                elements.push(
                    <View key={"sets" + i + liveData.eventId}
                          style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                        <Text style={{fontSize: 20}}>{home === -1 ? 0 : home}</Text>
                        <Text style={{fontSize: 20}}>{away === -1 ? 0 : away}</Text>
                    </View>
                )
            }
            elements.push(
                <View key={"score" + liveData.eventId}
                      style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                    <Text style={{fontSize: 20, color: "#00ADC9"}}>{score.home}</Text>
                    <Text style={{fontSize: 20, color: "#00ADC9"}}>{score.away}</Text>
                </View>
            )

            return elements;
        } else if (score) {
            return (
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Text style={{fontSize: 20}}>{score.home}</Text>
                    <Text style={{fontSize: 20}}>{score.away}</Text>
                </View>
            )
        }

        return null;
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