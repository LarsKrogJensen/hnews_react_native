import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, Text, View} from "react-native"
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {H2HResponse} from "api/typings";
import {loadHead2Head} from "store/stats/actions";


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
        const {h2h} = this.props

        if (!h2h) {
            return <Text>H2H not found</Text>
        }

        return (
            <Text>H2H</Text>
        )
    }
}


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

