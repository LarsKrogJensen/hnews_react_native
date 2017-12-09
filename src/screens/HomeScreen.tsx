import * as React from "react"
import {ComponentClass} from "react"
import {ActivityIndicator, RefreshControl, ScrollView, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {load} from "store/landing/actions";
import {EventCollection} from "store/landing/reducer";
import connectAppState from "components/AppStateRefresh";
import Screen from "screens/Screen";
import StartingSoonCard from "components/StartingSoonCard";
import TrendingCard from "components/TrendingCard";
import autobind from "autobind-decorator";
import LiveCard from "components/LiveCard";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface StateProps {
    liveRightNow: EventCollection
    popular: EventCollection
    highlights: EventCollection
    shocker: EventCollection
    nextOff: EventCollection
    startingSoon: EventCollection
    loading: boolean
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => any
}

type ComponentProps = StateProps & DispatchProps & ExternalProps


class HomeScreen extends React.Component<ComponentProps> {

    componentDidMount(): void {
        this.props.loadData(true)
    }

    public render() {

        return (
            <Screen title="Home" {...this.props} rootScreen>
                {this.renderBody()}
            </Screen>
        )
    }

    private renderBody() {
        const {loading} = this.props

        if (loading) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        return (
            <ScrollView
                refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}>
                {this.renderLiveRightNow()}
                {this.renderStartingSoon()}
                {this.renderTrending()}
            </ScrollView>
        )
    }

    private renderLiveRightNow() {
        return this.props.liveRightNow
            .events.map(eventId =>
                <LiveCard key={`lrn${eventId}`}
                          eventId={eventId}
                          navigation={this.props.navigation}/>
            )
    }

    private renderStartingSoon() {
        return this.props.startingSoon
            .events.map(eventId =>
                <StartingSoonCard key={`startingSoon${eventId}`}
                                  eventId={eventId}
                                  navigation={this.props.navigation}/>
            )
    }

    private renderTrending() {
        return this.props.popular
            .events.map(eventId =>
                <TrendingCard key={`trending${eventId}`}
                              eventId={eventId}
                              navigation={this.props.navigation}/>
            )
    }

    @autobind
    private onRefresh() {
        this.props.loadData(true)
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.landingStore.loading,
    liveRightNow: state.landingStore.liveRightNow,
    popular: state.landingStore.popular,
    highlights: state.landingStore.highlights,
    shocker: state.landingStore.shocker,
    nextOff: state.landingStore.nextOff,
    startingSoon: state.landingStore.startingSoon
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean) => dispatch(load(fireStartLoad))
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(HomeScreen)

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)


export default WithData