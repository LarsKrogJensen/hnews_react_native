import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {load} from "store/landing/actions";
import {EventCollection} from "store/landing/reducer";
import connectAppState from "components/containers/AppStateRefresh";
import CrossPlatformIcon from "components/CrossPlatformIcon";

type ComponentProps = StateProps & DispatchProps

class HomeScreen extends React.Component<ComponentProps> {
    // static navigationOptions = {
    //     drawerLabel: 'Home',
    //     drawerIcon: ({tintColor}) => (
    //         <CrossPlatformIcon name="home" size={30} color={tintColor} outline={false}/>
    //     )
    // };

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

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface StateProps {
    navigation: NavigationScreenProp<{}, {}>
    liveRightNow: EventCollection
    popular: EventCollection
    highlights: EventCollection
    shocker: EventCollection
    nextOff: EventCollection
    startingSoon: EventCollection
    loading: boolean
}

interface DispatchProps {
    loadData: () => any
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps) => ({
    loading: state.landingStore.loading,
    liveRightNow: state.landingStore.liveRightNow,
    popular: state.landingStore.popular,
    highlights: state.landingStore.highlights,
    shocker: state.landingStore.shocker,
    nextOff: state.landingStore.nextOff,
    startingSoon: state.landingStore.startingSoon,
    navigation: inputProps.navigation
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: () => dispatch(load())
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps) => props.loadData())(HomeScreen)

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)


export default WithData