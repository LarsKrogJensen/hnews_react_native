import * as React from "react"
import {ComponentClass, ReactNode} from "react"
import {ActivityIndicator, Animated, ScrollView, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadLanding} from "store/landing/actions";
import {EventCollection} from "store/landing/reducer";
import connectAppState from "components/hoc/AppStateRefresh";
import {StartingSoonCard} from "components/card/StartingSoonCard";
import {TrendingCard} from "components/card/TrendingCard";
import {LiveCard} from "components/card/LiveCard";
import {HighlightsCard} from "components/card/HighlightsCard";
import {CollapsableHeaderScreen, NAVBAR_HEIGHT, ScrollHooks} from "screens/CollapsableHeaderScreen"
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {Orientation} from "lib/device";
import {arrayEquals} from "lib/equallity";

interface ExternalProps {
    navigation: NavigationScreenProp<{}>
}

interface StateProps {
    liveRightNow: EventCollection
    popular: EventCollection
    shocker: EventCollection
    nextOff: EventCollection
    highlights: EventCollection
    startingSoon: EventCollection
    loading: boolean
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => any
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps


const AnimatedScrollView: ScrollView = Animated.createAnimatedComponent(ScrollView);

class HomeScreenComponent extends React.Component<ComponentProps> {

    componentDidMount(): void {
        this.props.loadData(true)
    }


    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true;
        if (nextProps.orientation !== this.props.orientation) return true;
        if (!arrayEquals(nextProps.liveRightNow.events, this.props.liveRightNow.events)) return true;
        if (!arrayEquals(nextProps.popular.events, this.props.popular.events)) return true;
        if (!arrayEquals(nextProps.shocker.events, this.props.shocker.events)) return true;
        if (!arrayEquals(nextProps.nextOff.events,  this.props.nextOff.events)) return true;
        if (!arrayEquals(nextProps.startingSoon.events, this.props.startingSoon.events)) return true;
        if (!arrayEquals(nextProps.highlights.events, this.props.highlights.events)) return true;

        return false
    }

    public render() {
        return (
            <CollapsableHeaderScreen title="Home" {...this.props} rootScreen renderBody={this.renderBody}/>
        )
    }

    private renderBody = (scrollHooks: ScrollHooks) => {
        const {loading} = this.props

        const cards: ReactNode[] = [
            ...this.renderLiveRightNow(),
            ...this.renderTrending(),
            ...this.renderHighlights(),
            ...this.renderStartingSoon()
        ]

        if (loading && !cards.length) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: NAVBAR_HEIGHT + 8}}/>
                </View>
            )
        }


        return (
            <AnimatedScrollView
                {...scrollHooks}
                style={{paddingBottom: 50}}>
                {/*{loading && <ActivityIndicator style={{marginTop: 8}}/>}*/}
                {this.props.orientation === Orientation.Portrait
                    ? cards
                    : this.divideIntoColumns(cards)
                }
            </AnimatedScrollView>
        )
    }

    private renderHighlights(): ReactNode[] {
        if (!this.props.highlights.events.length) {
            return []
        }

        return (
            [
                <HighlightsCard key="highlight"
                                navigation={this.props.navigation}/>
            ]
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

const mapStateToProps = (state: AppStore): StateProps => ({
    loading: state.landingStore.loading,
    liveRightNow: state.landingStore.liveRightNow,
    popular: state.landingStore.popular,
    shocker: state.landingStore.shocker,
    nextOff: state.landingStore.nextOff,
    highlights: state.landingStore.highlights,
    startingSoon: state.landingStore.startingSoon
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean) => dispatch(loadLanding(fireStartLoad))
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(HomeScreenComponent))

export const HomeScreen: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)


