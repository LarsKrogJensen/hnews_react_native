import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {H2HResponse, HistoricalEvent} from "api/typings";
import {loadHead2Head} from "store/stats/actions";
import {formatDateTime} from "lib/dates";


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
    h2h?: H2HResponse
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

class Head2HeadViewComponent extends React.Component<ComponentProps, ComponentState> {

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.h2h !== this.props.h2h) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        const {loading} = this.props;
        if (loading) {

            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        return this.renderBody()
    }

    private renderBody() {
        const {h2h, style} = this.props

        if (!h2h || !h2h.lastEvents || !h2h.lastEvents.length) {
            return null
        }

        return (
            <View style={style}>
                <Text style={styles.title}>Head 2 Head</Text>
                {
                    h2h.lastEvents.map((hist, index) =>
                        this.renderHistoricalEvent(hist, index))
                }
            </View>
        )
    }

    private renderHistoricalEvent(hist: HistoricalEvent, index: number) {

        const score = hist.scores && hist.scores.length ? hist.scores[0] : undefined;

        if (!score) {
            return null
        }

        return (
            <View key={index} style={[styles.row, {borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0}]}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={[styles.team, {textAlign: "right"}]}>{hist.homeParticipant.participantName}</Text>
                    <View style={styles.resultBox}>
                        <Text style={styles.result}>{score.homeScore}</Text>
                    </View>
                    <View style={styles.resultBox}>
                        <Text style={styles.result}>{score.awayScore}</Text>
                    </View>
                    <Text style={styles.team}>{hist.awayParticipant.participantName}</Text>
                </View>
                <View style={{marginTop: 4}}>
                    <Text>{formatDateTime(hist.start).date}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 8
    } as TextStyle,
    row: {
        padding: 8,
        marginHorizontal: 8,
        backgroundColor: "#F6F6F6",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#D1D1D1",
        flexDirection: "column",
        alignItems: "center",
    },
    resultBox: {
        width: 50,
        height: 40,
        marginRight: 4,
        backgroundColor: "black",
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    result: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    } as TextStyle,
    team: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 16
    } as TextStyle
})

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.h2hLoading.has(inputProps.eventId),
    h2h: state.statsStore.h2h.get(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadHead2Head(inputProps.eventId, fireStartLoad))
    },
})

export const Head2HeadView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(Head2HeadViewComponent))

