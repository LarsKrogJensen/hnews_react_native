import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {load} from "store/landing/actions";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
    liveRightNow: number[]
    popular: number[]
    highlights: number[]
    shocker: number[]
    nextOff: number[]
    startingSoon: number[]
    loading: boolean,
    loadData: () => void
}

class HomeScreen extends React.Component<Props> {

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        const {loading} = this.props

        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }

        return (
            <View>
            </View>
        )
    }
}

interface PropsIn {
    navigation: NavigationScreenProp<{}, {}>
}

interface StateProps {
    navigation: NavigationScreenProp<{}, {}>
    liveRightNow: number[]
    popular: number[]
    highlights: number[]
    shocker: number[]
    nextOff: number[]
    startingSoon: number[]
    loading: boolean
}

interface DispatchProps {
    loadData: () => any
}

const mapStateToProps = (state: AppStore, inputProps: PropsIn) => ({
    loading: state.landingStore.loading,
    liveRightNow: state.landingStore.liveRightNow,
    popular: state.landingStore.popular,
    highlights: state.landingStore.highlights,
    shocker: state.landingStore.shocker,
    nextOff: state.landingStore.nextOff,
    startingSoon: state.landingStore.startingSoon,
    navigation: inputProps.navigation
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: Props): DispatchProps => (
    {
        loadData: () => dispatch(load())
    }
)

const LiveEventsWithData: ComponentClass<PropsIn> =
    connect<StateProps, DispatchProps, PropsIn>(mapStateToProps, mapDispatchToProps)(HomeScreen)

export default LiveEventsWithData