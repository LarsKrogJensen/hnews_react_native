import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {EventStats, Score} from "api/typings";
import {renderServe, renderTeamColors} from "components/RenderUtils";
import {MatchClockItem} from "components/MatchClockItem";
import deepEqual from "deep-equal";

interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}>,
    asHeader?: boolean,
    style?: ViewStyle,
    showMatchClock?: boolean
}

interface StateProps {
    event?: EventEntity,
    statistics?: EventStats
    score?: Score
}

type Props = StateProps & ExternalProps

export class LiveCardScoreComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (!deepEqual(nextProps.statistics, this.props.statistics, {strict: true})) return true
        if (!deepEqual(nextProps.score, this.props.score, {strict: true})) return true

        return false
    }

    public render() {
        const {event, statistics, score, asHeader, style, showMatchClock} = this.props;
        const teamTextStyle = asHeader ? styles.teamTextHeader : styles.teamText

        if (!event) {
            return null
        }
        return (
            <View style={[style, {flexDirection: "row", marginRight: 8}]}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <View style={styles.teamRow}>
                        {renderTeamColors(event.teamColors && event.teamColors.home)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={teamTextStyle}>{event.homeName}</Text>
                        {statistics && renderServe(statistics, true)}
                    </View>
                    <View style={[styles.teamRow, {marginBottom: 8}]}>
                        {renderTeamColors(event.teamColors && event.teamColors.away)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={teamTextStyle}>{event.awayName}</Text>
                        {statistics && renderServe(statistics, false)}
                    </View>
                </View>
                {this.renderScoreColumns(event.id, statistics, score)}
                {showMatchClock && this.renderMatchClock(event.id)}
            </View>
        )
    }

    private renderScoreColumns(eventId: number, statistics?: EventStats, score?: Score) {
        const scoreStyle = this.props.asHeader ? styles.scoreTextHeader : styles.scoreText
        if (statistics && statistics.sets && score) {
            const elements: JSX.Element[] = []

            const homeSets = statistics.sets.home;
            const awaySets = statistics.sets.away;

            for (let i = 0; i < homeSets.length; i++) {
                const home = homeSets[i];
                const away = awaySets[i];

                elements.push(
                    <View key={"sets" + i + eventId}
                          style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                        <Text style={scoreStyle}>{home === -1 ? 0 : home}</Text>
                        <Text style={scoreStyle}>{away === -1 ? 0 : away}</Text>
                    </View>
                )
            }
            elements.push(
                <View key={"score" + eventId}
                      style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                    <Text style={[scoreStyle, {color: "#00ADC9"}]}>{score.home}</Text>
                    <Text style={[scoreStyle, {color: "#00ADC9"}]}>{score.away}</Text>
                </View>
            )

            return elements;
        } else if (score) {
            return (
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Text style={scoreStyle}>{score.home}</Text>
                    <Text style={scoreStyle}>{score.away}</Text>
                </View>
            )
        }

        return null;
    }

    private renderMatchClock(eventId: number) {
        return (
            <MatchClockItem eventId={eventId} style={{marginLeft: 8, alignSelf: "center"}} asHeader/>
        )
    }
}

const styles = StyleSheet.create({
    scoreText: {
        fontSize: 20
    },
    scoreTextHeader: {
        fontSize: 18,
        color: "white",
        paddingHorizontal: 2,
        backgroundColor: "black",
        marginVertical: 1,
        borderRadius: 2
    } as TextStyle,
    teamText: {
        fontSize: 18,
        flex: 1,
        marginLeft: 8
    } as TextStyle,
    teamTextHeader: {
        fontSize: 18,
        flex: 1,
        marginLeft: 8,
        textShadowColor: "white",
        textShadowOffset: {width: -2, height: 2},
        textShadowRadius: 2
    } as TextStyle,
    teamRow: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle

})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    statistics: state.statsStore.statistics.get(inputProps.eventId),
    score: state.statsStore.scores.get(inputProps.eventId),
})

export const LiveCardScore: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveCardScoreComponent)

