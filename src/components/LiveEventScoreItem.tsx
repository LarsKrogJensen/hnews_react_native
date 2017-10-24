import * as React from "react"
import {LiveData, MatchClock, Score, Statistics} from "api/typings";
import {Text, TextStyle, View, ViewStyle} from "react-native";

interface Props {
    style: ViewStyle,
    liveData?: LiveData,
    sport: string
}

interface GameSummary {
    homeSets: number,
    awaySets: number,
    homeGames: number,
    awayGames: number
}

export default class LiveEventScoreItem extends React.Component<Props> {
    private scoreStyle: TextStyle = {
        color: "#202020",
        fontSize: 16,
        fontWeight: "400"
    }
    private timeStyle: TextStyle = {fontSize: 12, color: "#717171", marginTop: 4}

    constructor(props: Props, context: any) {
        super(props, context);
        this.renderFootball = this.renderFootball.bind(this);
        this.renderSetBased = this.renderSetBased.bind(this);
    }

    public render() {
        const {statistics: stats, score, matchClock} = this.props.liveData
        const sport = this.props.sport

        if (stats && stats.football && score) {
            return this.renderFootball(score, matchClock)
        } else if (stats && stats.sets && score) {
            return this.renderSetBased(stats, score, sport === "TENNIS")
        } else if (score) {
            return this.renderFootball(score, matchClock)
        }

        return <View style={this.props.style}/>
    }

    private renderFootball(score: Score, matchClock: MatchClock) {
        return (
            <View style={{...this.props.style, alignItems: "center"}}>
                <Text style={this.scoreStyle}>{score.home}</Text>
                <Text style={this.scoreStyle}>{score.away}</Text>
                <Text style={this.timeStyle}>{matchClock.minute}:{this.leftPad(matchClock.second.toString(), 2)}</Text>
            </View>
        );
    }

    private renderSetBased(stats: Statistics, score: Score, hasGames: boolean) {
        const summary = this.calculateSetSummary(stats, hasGames)
        return (
            <View style={{...this.props.style, flexDirection: "row"}}>
                <View>
                    <Text style={this.scoreStyle}>{summary.homeSets}</Text>
                    <Text style={this.scoreStyle}>{summary.awaySets}</Text>
                </View>
                <View>
                    <Text style={this.scoreStyle}>{summary.homeGames}</Text>
                    <Text style={this.scoreStyle}>{summary.awayGames}</Text>
                </View>
                <View>
                    <Text style={this.scoreStyle}>{score.home}</Text>
                    <Text style={this.scoreStyle}>{score.away}</Text>
                </View>
            </View>
        );
    }

    private calculateSetSummary(stats: Statistics, hasGames: boolean): GameSummary {
        const summary: GameSummary = {homeSets: 0, awaySets: 0, homeGames: 0, awayGames: 0}
        if (stats && stats.sets) {
            const sets = stats.sets;
            const numberOfSets = sets.home.length;
            const firstUnplayedSetIndex = sets.home.indexOf(-1);
            let currentSet = (firstUnplayedSetIndex === -1) ? numberOfSets - 1 : firstUnplayedSetIndex;
            for (let i = currentSet; i >= 0; i++) {
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

    private leftPad(str: string, len: number, ch = '0'): string {
        len = len - str.length + 1;
        return len > 0 ?
            new Array(len).join(ch) + str : str;
    }
}