import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, Text, View} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {H2HResponse, TPIResponse} from "api/typings";
import {loadHead2Head, loadTeamPerformance} from "store/stats/actions";


interface ExternalProps {
    eventId: number
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
        const {tpi} = this.props

        if (!tpi) {
            return <Text>TPI not found</Text>
        }

        return (
            <Text>TPI</Text>
        )
    }
}


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

