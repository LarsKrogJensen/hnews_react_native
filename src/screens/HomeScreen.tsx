import * as React from "react"
import {ComponentClass, ReactNode} from "react"
import {ActivityIndicator, Animated, RefreshControl, ScrollView, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadLanding} from "store/landing/actions";
import {loadOpenForLive} from "store/live/actions";
import {EventCollection} from "store/landing/reducer";
import connectAppState from "components/AppStateRefresh";
import StartingSoonCard from "components/StartingSoonCard";
import TrendingCard from "components/TrendingCard";
import autobind from "autobind-decorator";
import LiveCard from "components/LiveCard";
import {HighlightsCard} from "components/HighlightsCard";
import {CollapsableHeaderScreen, NAVBAR_HEIGHT, ScrollHooks} from "screens/CollapsableHeaderScreen"
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {Orientation} from "lib/device";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface StateProps {
    liveRightNow: EventCollection
    popular: EventCollection
    shocker: EventCollection
    nextOff: EventCollection
    startingSoon: EventCollection
    loading: boolean
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => any
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps


const AnimatedScrollView: ScrollView = Animated.createAnimatedComponent(ScrollView);

class HomeScreen extends React.Component<ComponentProps> {

    componentDidMount(): void {
        this.props.loadData(true)
    }


    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true;
        if (nextProps.orientation !== this.props.orientation) return true;
        if (nextProps.liveRightNow.events.length !== this.props.liveRightNow.events.length) return true;
        if (nextProps.popular.events.length !== this.props.popular.events.length) return true;
        if (nextProps.shocker.events.length !== this.props.shocker.events.length) return true;
        if (nextProps.nextOff.events.length !== this.props.nextOff.events.length) return true;
        if (nextProps.startingSoon.events.length !== this.props.startingSoon.events.length) return true;

        if (nextProps.popular.events.join() !== this.props.popular.events.join()) return true;
        if (nextProps.shocker.events.join() !== this.props.shocker.events.join()) return true;
        if (nextProps.nextOff.events.join() !== this.props.nextOff.events.join()) return true;
        if (nextProps.startingSoon.events.join() !== this.props.startingSoon.events.join()) return true;

        return false
    }

    public render() {
        return (
            <CollapsableHeaderScreen title="Home" {...this.props} rootScreen renderBody={this.renderBody}/>
        )
    }

    @autobind
    private renderBody(scrollHooks: ScrollHooks) {
        const {loading} = this.props

        if (loading) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: NAVBAR_HEIGHT + 8}}/>
                </View>
            )
        }

        const cards: ReactNode[] = [
            ...this.renderLiveRightNow(),
            ...this.renderTrending(),
            this.renderHighlights(),
            ...this.renderStartingSoon()
        ]
        return (
            <AnimatedScrollView
                {...scrollHooks}
                refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}>

                    {this.props.orientation === Orientation.Portrait
                        ? cards
                        : this.divideIntoColumns(cards)
                    }
            </AnimatedScrollView>
        )
    }

    private renderHighlights(): ReactNode {
        return (
            <HighlightsCard key="highlight"
                            navigation={this.props.navigation}/>
        )
    }

    private renderLiveRightNow(): ReactNode[] {
        return this.props.liveRightNow.events.map(eventId =>
            <LiveCard key={`lrn${eventId}`}
                      eventId={eventId}
                      navigation={this.props.navigation}/>
        )
    }

    private renderStartingSoon(): ReactNode[] {
        return this.props.startingSoon
            .events.map(eventId =>
                <StartingSoonCard key={`startingSoon${eventId}`}
                                  eventId={eventId}
                                  navigation={this.props.navigation}/>
            )
    }

    private renderTrending(): ReactNode[] {
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

    private divideIntoColumns(cards: ReactNode[]): ReactNode {
        return (
            <View style={{flexDirection: "row"}}>
                <View style={{flex: 1}}>
                    {cards.filter((_, index) => index % 2 === 0)}
                </View>
                <View style={{flex: 1}}>
                    {cards.filter((_, index) => index % 2 === 1)}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.landingStore.loading,
    liveRightNow: state.landingStore.liveRightNow,
    popular: state.landingStore.popular,
    shocker: state.landingStore.shocker,
    nextOff: state.landingStore.nextOff,
    startingSoon: state.landingStore.startingSoon
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean) => {
            dispatch(loadLanding(fireStartLoad))
        }
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(HomeScreen))

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)


export default WithData