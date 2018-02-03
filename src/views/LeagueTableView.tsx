import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, Text, View} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {LeagueTable} from "api/typings";
import {loadLeagueTable} from "store/stats/actions";


interface ExternalProps {
    eventId: number
    eventGroupId: number
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


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.leagueTableLoading.has(inputProps.eventGroupId),
    leagueTable: state.statsStore.leagueTable.get(inputProps.eventGroupId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLeagueTable(inputProps.eventGroupId, fireStartLoad))
    },
})

export const LeagueTableView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(LeagueTableViewComponent))

