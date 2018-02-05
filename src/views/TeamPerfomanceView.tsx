import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {HistoricalEvent, HistoricalEventScore, TeamParticipantWithEvents, TPIResponse} from "api/typings";
import {loadTeamPerformance} from "store/stats/actions";
import autobind from "autobind-decorator";

interface ExternalProps {
    eventId: number,
    style?: ViewStyle
}

interface ComponentState {
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    tpi?: TPIResponse
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

class TeamPerformanceViewComponent extends React.Component<ComponentProps, ComponentState> {

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.tpi !== this.props.tpi) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        const {loading, style} = this.props;
        if (loading) {

            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        return this.renderBody()
    }

    private renderBody() {
        const {tpi, style} = this.props

        if (!tpi) {
            return null
        }

        return (
            <View style={style}>
                {this.renderFormTitle()}
                {this.renderFormSummary(tpi)}
                {this.renderTeamHistory(tpi.homeParticipant)}
                {this.renderTeamHistory(tpi.awayParticipant)}
            </View>
        )
    }

    private renderFormTitle() {
        return <Text style={styles.title}>FORM</Text>
    }

    private renderFormSummary(tpi: TPIResponse) {
        const homeResults: number[] = tpi.homeParticipant.lastEvents.map(hist => this.scoreToResult(hist.scores))
        const awayResults: number[] = tpi.awayParticipant.lastEvents.map(hist => this.scoreToResult(hist.scores))

        return (
            <View style={{flexDirection: "row", justifyContent: "center", marginVertical: 4}}>
                {homeResults.map((value, index) => this.renderResult(value, index * 1000))}
                <Icon style={{padding: 4, marginRight: 8, marginLeft: 4}}
                      name="md-trending-up"
                      size={30}
                      color="black"/>
                {awayResults.map((value, index) => this.renderResult(value, index * 1000))}
            </View>
        )
    }

    private renderTeamHistory(team: TeamParticipantWithEvents) {
        return (
            <View style={{marginHorizontal: 8}}>
                <Text style={{
                    fontSize: 16,
                    paddingVertical: 8,
                    borderBottomWidth: StyleSheet.hairlineWidth
                }}>{team.participantName}</Text>
                {team.lastEvents.map((hist, index) => this.renderHistoricalEvent(hist, team.participantId + "-" + index))}
            </View>
        )
    }

    private renderHistoricalEvent(hist: HistoricalEvent, key: string) {

        const score = hist.scores && hist.scores.length ? hist.scores[0] : undefined;

        if (!score) {
            return null
        }

        let result = this.scoreToResult(hist.scores);
        return (
            <View key={key}
                  style={styles.row}>
                {this.renderResult(result, 1, {width: 40, height: 35, fontSize: 20})}
                <View style={{flexDirection: "column", marginLeft: 8, height: 35, flex: 1}}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{
                            flex: 1,
                            fontWeight: result > 0 ? "bold" : "normal"
                        }}>{hist.homeParticipant.participantName}</Text>
                        <Text style={{fontWeight: result > 0 ? "bold" : "normal"}}>{score.homeScore}</Text>
                    </View>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{
                            flex: 1,
                            fontWeight: result < 0 ? "bold" : "normal"
                        }}>{hist.awayParticipant.participantName}</Text>
                        <Text style={{fontWeight: result < 0 ? "bold" : "normal"}}>{score.awayScore}</Text>
                    </View>

                </View>
            </View>
        )
    }

    private renderResult(result: number, key: number, style: TextStyle = {}) {

        if (result > 0) {
            return <Text key={key} style={[styles.resultCommon, styles.resultWon, style]}>W</Text>
        }
        if (result < 0) {
            return <Text key={key} style={[styles.resultCommon, styles.resultLost, style]}>L</Text>
        }

        return <Text key={key} style={[styles.resultCommon, styles.resultDraw, style]}>D</Text>
    }

    @autobind
    private scoreToResult(scores: HistoricalEventScore[]): number {
        if (scores && scores.length) {
            const score = scores[0]
            if (score.homeScore !== undefined && score.awayScore !== undefined) {
                return score.homeScore - score.awayScore
            } else if (score.winner) {
                return score.winner === "HOME" ? 1 :
                    score.winner === "AWAY" ? -1 : 0
            }
        }

        return 0 // draw
    }
}

const styles = StyleSheet.create({
    row: {
        padding: 8,
        backgroundColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#D1D1D1",
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    title: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center"
    } as TextStyle,
    resultCommon: {
        width: 25,
        height: 35,
        padding: 4,
        textAlign: "center",
        marginRight: 4,
        fontSize: 18,
        fontWeight: "bold",
        borderRadius: 3
    } as TextStyle,
    resultWon: {
        backgroundColor: "#B8E986",
        color: "#729D46",
    } as TextStyle,
    resultDraw: {
        backgroundColor: "#98D5F4",
        color: "#4C88A6",
    } as TextStyle,
    resultLost: {
        backgroundColor: "#E98686",
        color: "#BE2828",
    } as TextStyle
})

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.tpiLoading.has(inputProps.eventId),
    tpi: state.statsStore.tpi.get(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadTeamPerformance(inputProps.eventId, fireStartLoad))
    },
})

export const TeamPerformanceView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(TeamPerformanceViewComponent))

