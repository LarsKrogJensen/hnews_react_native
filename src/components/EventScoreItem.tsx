import * as React from "react"
import {LiveData, MatchClock, Score, SetStats, Statistics} from "api/typings";
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import MatchClockItem from "components/MatchClockItem";
import {Theme} from "lib/device";

interface Props {
    style: ViewStyle,
    liveData?: LiveData,
    sport: string
    theme?: Theme
}

interface GameSummary {
    homeSets: number,
    awaySets: number,
    homeGames: number,
    awayGames: number
}

export default class EventScoreItem extends React.PureComponent<Props> {

    public render() {
        if (this.props.liveData) {
            const {statistics: stats, score, matchClock} = this.props.liveData
            const sport = this.props.sport

            if (stats && stats.football && score) {
                return this.renderFootball(score, matchClock)
            } else if (stats && stats.sets && score) {
                return this.renderSetBased(stats, score, sport === "TENNIS")
            } else if (score) {
                return this.renderFootball(score, matchClock)
            }
        }

        return <View style={this.props.style}/>
    }

    @autobind
    private renderFootball(score: Score, matchClock: MatchClock) {
        return (
            <View style={{...this.props.style, alignItems: "center"}}>
                <Text style={setStyle}>{score.home}</Text>
                <Text style={setStyle}>{score.away}</Text>
                <MatchClockItem matchClock={matchClock} style={timeStyle}/>
            </View>
        );
    }

    @autobind
    private renderSetBased(stats: Statistics, score: Score, hasGames: boolean) {
        const summary = this.calculateGameSummary(stats, hasGames)
        return (
            <View style={{...this.props.style, flexDirection: "row", justifyContent: "center"}}>
                <View style={{marginRight: 4, alignItems: "center"}}>
                    <Text style={setStyle}>{summary.homeSets}</Text>
                    <Text style={setStyle}>{summary.awaySets}</Text>
                </View>
                {
                    hasGames && (
                        <View style={{marginRight: 4, alignItems: "center"}}>
                            <Text style={setStyle}>{summary.homeGames}</Text>
                            <Text style={setStyle}>{summary.awayGames}</Text>
                        </View>)
                }
                <View style={{alignItems: "center"}}>
                    <Text style={scoreStyle}>{score.home}</Text>
                    <Text style={scoreStyle}>{score.away}</Text>
                </View>
            </View>
        );
    }

    private calculateGameSummary(stats: Statistics, hasGames: boolean): GameSummary {
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

const setStyle: TextStyle = {
    color: "#202020",
    fontSize: 16,
    fontWeight: "400"
}
const scoreStyle: TextStyle = {
    ...setStyle,
    color: "#00ADC9"
}
const timeStyle: TextStyle = {
    fontSize: 12,
    color: "#717171",
    marginTop: 2
}