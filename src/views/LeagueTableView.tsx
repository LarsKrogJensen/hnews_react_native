import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {LeagueTable} from "api/typings";
import {loadLeagueTable} from "store/stats/actions";


interface ExternalProps {
    eventId: number
    eventGroupid: number
}

interface ComponentState {
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    leagueTable: LeagueTable
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps


class EventStatsViewComponent extends React.Component<ComponentProps, ComponentState> {

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
        const {leagueTable} = this.props

        if (!leagueTable || !leagueTable.leagueTableRows || !leagueTable.leagueTableRows.length) {
            return <Text>League table not found</Text>
        }

        return (
            this.props.leagueTable.leagueTableRows.map(row => (
                <Text key={row.position}>{row.participantName}</Text>
            ))
        )
    }
}

// styles
const styles = StyleSheet.create({
    header: {
        padding: 8,
        height: 44,
        backgroundColor: "white",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    sectionTitleText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        flex: 1
    } as TextStyle,
    sectionCount: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8
    } as TextStyle,
    listItemStyle: {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "column"
    } as ViewStyle
})


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.leagueTableLoading.has(inputProps.eventGroupid),
    leagueTable: state.statsStore.leagueTable.get(inputProps.eventGroupid)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLeagueTable(inputProps.eventGroupid, fireStartLoad))
    },
})

export const LeagueTableView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(EventStatsViewComponent))

