import * as React from "react"
import {ComponentClass} from "react"
import {Card} from "react-native-material-ui";
import {Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import BetOfferItem from "components/BetOfferItem"
import {Orientation} from "lib/device";
import {LiveData} from "api/typings";
import MatchClockItem from "components/MatchClockItem";

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
            <Card style={{container: cardStyle}} onPress={() => this.props.navigation.navigate("Event")}>
                <View>
                    {this.renderHeader()}
                    {this.renderBody()}
                </View>
            </Card>
        )
    }

    private renderHeader() {
        const event = this.props.event;
        return (
            <View style={headerStyle}>
                <View style={pathStyle}>
                    {this.renderPath(event)}
                </View>
                <MatchClockItem matchClock={this.props.liveData.matchClock}/>
            </View>
        )
    }

    private renderBody() {
        const {event, liveData} = this.props;

        const rowStyle: ViewStyle = {
            marginLeft: 8,
            marginRight: 8,
            marginTop: 4,
            marginBottom: 0,
            flexDirection: "row",
            alignItems: "center"
        }
        return (
            <View style={bodyStyle}>
                <View style={rowStyle}>
                    <Text style={{fontSize: 20, flex: 1}}>{event.homeName}</Text>
                    {this.renderScore(liveData, true)}
                </View>
                <View style={{...rowStyle, marginBottom: 8}}>
                    <Text style={{fontSize: 20, flex: 1}}>{event.awayName}</Text>
                    {this.renderScore(liveData, false)}
                </View>
                <BetOfferItem orientation={Orientation.Portrait} betofferId={event.mainBetOfferId}/>
            </View>
        )
    }

    private renderScore(liveData: LiveData, home: boolean) {
        const {statistics: stats, score} = liveData

        if (stats && stats.football && score) {
            return <Text style={{fontSize: 20}}>{home ? score.home : score.away}</Text>
        } else if (stats && stats.sets && score) {
            return this.renderSetScore(home ? stats.sets.home : stats.sets.away, home ? score.home : score.away)
        }

        return <Text style={{fontSize: 20}}>0</Text>
    }

    private renderSetScore(sets: number[], score: string) {
        const elements = sets.map(value => <Text style={{marginLeft: 4, fontSize: 20}}>{value}</Text>)
        elements.push(<Text style={{marginLeft: 4, fontSize: 20, color: "#00ADC9"}}>{score}</Text>)

        return elements
    }

    private renderPath(event: EventEntity): JSX.Element[] {
        const pathArray: JSX.Element[] = []
        event.path.forEach((path, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={pathSeparatorStyle}>/</Text>)
            }
            pathArray.push(<Text key={index}
                                 numberOfLines={1}
                                 ellipsizeMode="tail"
                                 style={pathEntryStyle}>{path.name}</Text>)
        })
        return pathArray;
    }
}

const cardStyle: ViewStyle = {
    backgroundColor: "#F6F6F6"
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

const pathStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row"
}

const pathEntryStyle: TextStyle = {
    fontSize: 16,
    color: "#717171"
}

const pathSeparatorStyle: TextStyle = {
    ...pathEntryStyle,
    paddingLeft: 4,
    paddingRight: 4
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId)
})

const LiveCard: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveCardComponent)

export default LiveCard