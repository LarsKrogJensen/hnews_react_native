import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {EventGroup, LeagueTable, LeagueTableRow} from "api/typings";
import {loadLeagueTable} from "store/stats/actions";

interface ExternalProps {
    eventId: number
    eventGroupId: number
    style?: ViewStyle
}

interface ComponentState {
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    leagueTable: LeagueTable
    eventGroup: EventGroup
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps


class LeagueTableViewComponent extends React.Component<ComponentProps, ComponentState> {

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.leagueTable !== this.props.leagueTable) return true
        if (nextProps.leagueTable.leagueTableRows.length !== this.props.leagueTable.leagueTableRows.length) return true
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
        const {leagueTable, style, eventGroup} = this.props

        if (!leagueTable || !leagueTable.leagueTableRows || !leagueTable.leagueTableRows.length) {
            return null
        }
        if (!eventGroup) {
            return null
        }

        return (
            <View style={style}>
                <Text style={styles.title}>League Table</Text>
                {this.renderLeagueHeader()}
                {
                    leagueTable.leagueTableRows
                        .sort((a, b) => a.position - b.position)
                        .map((row, index) => this.renderLeagueRow(row, index))
                }
                {this.renderLedgend()}
            </View>
        )
    }

    private renderLeagueHeader() {
        return (
            <View style={[styles.row, {backgroundColor: "transparent", borderTopWidth: StyleSheet.hairlineWidth}]}>

                <Text style={{marginLeft: 8, flex: 1, fontWeight: "bold"}}>{this.props.eventGroup.name}</Text>
                <Text style={[styles.col, styles.headerCol]}>P</Text>
                <Text style={[styles.col, styles.headerCol]}>W</Text>
                <Text style={[styles.col, styles.headerCol]}>D</Text>
                <Text style={[styles.col, styles.headerCol]}>L</Text>
                <Text style={[styles.col, styles.headerCol]}>+/-</Text>
                <Text style={[styles.col, styles.ptsCol, styles.headerCol]}>Pts</Text>
            </View>
        )
    }

    private renderLeagueRow(row: LeagueTableRow, index: number) {
        return (
            <View key={row.position} style={[styles.row, {borderTopWidth: index === 0 ? StyleSheet.hairlineWidth : 0}]}>
                <View style={this.positionToBackgroundStyle(row.position)}>
                    <Text style={this.positionToTextStyle(row.position)}>{row.position}</Text>
                </View>
                <Text numberOfLines={1} ellipsizeMode="tail"
                      style={{marginLeft: 8, flex: 1, fontWeight: "bold"}}>{row.participantName}</Text>
                <Text style={styles.col}>{row.gamesPlayed}</Text>
                <Text style={styles.col}>{row.wins}</Text>
                <Text style={styles.col}>{row.draws}</Text>
                <Text style={styles.col}>{row.losses}</Text>
                <Text style={styles.col}>{row.goalsFor - row.goalsAgainst}</Text>
                <Text style={[styles.col, styles.ptsCol]}>{row.points}</Text>
            </View>
        )
    }

    private positionToBackgroundStyle(position: number): ViewStyle[] {
        if (position < 3) {
            return [styles.defaultPositionBackground, styles.winnerBack]
        }
        if (position < 5) {
            return [styles.defaultPositionBackground, styles.runnerUpBack]
        }
        if (position > 15) {
            return [styles.defaultPositionBackground, styles.looserBack]
        }

        return [styles.defaultPositionBackground]
    }

    private positionToTextStyle(position: number): TextStyle {
        if (position < 3) {
            return styles.winnerText
        }
        if (position < 5) {
            return styles.runnerUpText
        }
        if (position > 15) {
            return styles.looserText
        }

        return styles.defaultPositionText
    }

    private renderLedgend() {
        return (
            <View style={{flexDirection: "column", margin: 8}}>
                <View style={styles.legendRow}>
                    <View style={[styles.defaultPositionBackground, styles.winnerBack]}/>
                    <Text style={styles.legendText}>UEFA Champions League</Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={[styles.defaultPositionBackground, styles.runnerUpBack]}/>
                    <Text style={styles.legendText}>UEFA Europa League</Text>
                </View>
                <View style={styles.legendRow}>
                    <View style={[styles.defaultPositionBackground, styles.looserBack]}/>
                    <Text style={styles.legendText}>Relegation</Text>
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
    headerCol: {
        fontWeight: "bold",
        textAlign: "center"
    } as TextStyle,
    col: {
        marginLeft: 8,
        textAlign: "right",
        width: 20
    } as TextStyle,
    ptsCol: {
        width: 25
    } as TextStyle,
    legendRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    } as ViewStyle,
    legendText: {
        marginLeft: 8
    } as TextStyle,
    row: {
        padding: 8,
        marginHorizontal: 8,
        backgroundColor: "#F6F6F6",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#D1D1D1",
        flexDirection: "row",
        alignItems: "center",
    },
    team: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 16
    } as TextStyle,
    defaultPositionBackground: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    defaultPositionText: {
        color: "black"
    } as TextStyle,
    winnerBack: {
        backgroundColor: "#B8E986",
    } as ViewStyle,
    winnerText: {
        color: "#729D46",
    } as TextStyle,
    runnerUpBack: {
        backgroundColor: "#98D5F4",
    } as ViewStyle,
    runnerUpText: {
        color: "#4C88A6",
    } as TextStyle,
    looserBack: {
        backgroundColor: "#E98686",
    } as ViewStyle,
    looserText: {
        color: "#BE2828",
    } as TextStyle,

})

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.leagueTableLoading.has(inputProps.eventGroupId),
    leagueTable: state.statsStore.leagueTable.get(inputProps.eventGroupId),
    eventGroup: state.groupStore.groupById.get(inputProps.eventGroupId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLeagueTable(inputProps.eventGroupId, fireStartLoad))
    },
})

export const LeagueTableView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(LeagueTableViewComponent))

