import * as React from "react"
import {ComponentClass} from "react"
import {EventStats, Score, SetStats} from "api/typings";
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {MatchClockItem} from "components/MatchClockItem";
import {connect} from "react-redux";
import {AppStore} from "store/store";

interface ExternalProps {
    eventId: number
    style: ViewStyle,
    sport: string
}

interface StateProps {
    score?: Score
    eventStats?: EventStats
}

interface GameSummary {
    homeSets: number,
    awaySets: number,
    homeGames: number,
    awayGames: number
}

type Props = ExternalProps & StateProps

class EventScoreComponent extends React.PureComponent<Props> {

    public render() {
        const {eventId, score, eventStats: stats} = this.props
        const sport = this.props.sport

        if (stats && stats.football && score) {
            return this.renderFootball(score, eventId)
        } else if (stats && stats.sets && score) {
            return this.renderSetBased(stats, score, sport === "TENNIS")
        } else if (score) {
            return this.renderFootball(score, eventId)
        }

        return <View style={this.props.style}/>
    }

    private renderFootball = (score: Score, eventId: number) => {
        return (
            <View style={{...this.props.style, alignItems: "center"}}>
                <Text style={styles.sets}>{score.home}</Text>
                <Text style={styles.sets}>{score.away}</Text>
                <MatchClockItem eventId={eventId} style={styles.time}/>
            </View>
        );
    }

    private renderSetBased = (stats: EventStats, score: Score, hasGames: boolean) => {
        const summary = this.calculateGameSummary(stats, hasGames)
        return (
            <View style={{...this.props.style, flexDirection: "row", justifyContent: "center"}}>
                <View style={{marginRight: 4, alignItems: "center"}}>
                    <Text style={styles.sets}>{summary.homeSets}</Text>
                    <Text style={styles.sets}>{summary.awaySets}</Text>
                </View>
                {
                    hasGames && (
                        <View style={{marginRight: 4, alignItems: "center"}}>
                            <Text style={styles.sets}>{summary.homeGames}</Text>
                            <Text style={styles.sets}>{summary.awayGames}</Text>
                        </View>)
                }
                <View style={{alignItems: "center"}}>
                    <Text style={[styles.sets, styles.score]}>{score.home}</Text>
                    <Text style={[styles.sets, styles.score]}>{score.away}</Text>
                </View>
            </View>
        );
    }

    private calculateGameSummary(stats: EventStats, hasGames: boolean): GameSummary {
        const summary: GameSummary = {homeSets: 0, awaySets: 0, homeGames: 0, awayGames: 0}
        if (stats && stats.sets) {
            const sets: SetStats = stats.sets;
            const numberOfSets = sets.home.length;
            const firstUnplayedSetIndex: number = sets.home.indexOf(-1);
            let currentSet = (firstUnplayedSetIndex === -1) ? numberOfSets - 1 : firstUnplayedSetIndex;

            // in tennis, the current set is the last one with a score, not the first one without
            if (hasGames && sets.home[currentSet] === -1 && sets.away[currentSet] === -1) {
                currentSet -= 1;
            }

            // if the score in the previous set is level, that set has not yet ended. it is likely a tie-break
            if (currentSet > 0 && sets.home[currentSet - 1] === sets.away[currentSet - 1]) {
                currentSet -= 1;
            } else if (hasGames &&
                currentSet > 0 &&
                (sets.home[currentSet] + sets.away[currentSet] === 0) &&
                Math.abs(sets.home[currentSet - 1] - sets.away[currentSet - 1]) === 1 &&
                Math.max(sets.home[currentSet - 1], sets.away[currentSet - 1]) === 6) {
                // DUE to NLS BUG
                currentSet -= 1;
            }

            for (let i = currentSet; i >= 0; i--) {
                const home: number = sets.home[i];
                const away: number = sets.away[i];

                if (hasGames && i === currentSet) {
                    summary.homeGames = home
                    summary.awayGames = away
                } else {
                    if (home > away) summary.homeSets++
                    if (home < away) summary.awaySets++
                }
            }
        }

        return summary
    }
}

const styles = StyleSheet.create({
    sets:  {
        color: "#202020",
        fontSize: 16,
        fontWeight: "400"
    } as TextStyle,
    score: {
        color: "#00ADC9"
    } as TextStyle,
    time: {
        fontSize: 12,
        color: "#717171",
        marginTop: 2
    } as TextStyle
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    score: state.statsStore.scores.get(inputProps.eventId),
    eventStats: state.statsStore.statistics.get(inputProps.eventId)
})

export const EventScoreItem: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(EventScoreComponent)