import * as React from "react"
import {ComponentClass} from "react"
import {Animated, Dimensions, StyleSheet, Text, ViewStyle} from "react-native"
import {NavigationParams, NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {EventInfoItem} from "components/EventInfoItem";
import {Theme} from "lib/device";
import Screen from "screens/Screen";
import {LiveCardScore} from "components/LiveCardScore";
import {NavigationState, RouteBase, Scene, SceneRendererProps, TabBar, TabViewAnimated} from "react-native-tab-view";
import autobind from "autobind-decorator";
import {EventMarketsView} from "views/EventMarketsView";
import {EventPrematchStatsView} from "views/EventPrematchStatsView";
import {EventLiveStatsView} from "views/EventLiveStatsView";

interface ExternalProps {
    navigation: NavigationScreenProp<{ params: NavigationParams }, {}>
    eventId: number
    style?: ViewStyle
}

interface StateProps {
    event: EventEntity
}

interface State {
    tabIndex: number
}

interface PageRoute extends RouteBase {
    title: string
}

type Props = StateProps & ExternalProps

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
}

class EventScreenComponent extends React.Component<Props, State> {
    state = {
        tabIndex: 0
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if (this.props.eventId !== nextProps.eventId) return true
        if (this.props.event && !nextProps.event) return true
        if (!this.props.event && nextProps.event) return true
        if (this.props.event.state && nextProps.event.state) return true
        if (this.props.event.openForLiveBetting && nextProps.event.openForLiveBetting) return true
        if (this.state.tabIndex !== nextState.tabIndex) return true

        return false
    }

    public render() {
        return (
            <Screen navigation={this.props.navigation} title={this.renderTitle()}>
                {this.renderBody()}
            </Screen>
        )
    }

    private renderTitle() {
        const {event, navigation} = this.props

        if (!event) {
            return "Event not found"
        }

        if (event.state === "STARTED") {
            return <LiveCardScore eventId={event.id} navigation={navigation} asHeader/>
        }

        return <EventInfoItem eventId={event.id} theme={Theme.Dark} viewStyle={{flex: 1}}/>
    }

    private renderBody() {
        const {event} = this.props

        if (!event) {
            return <Text>Event not available</Text>
        }

        const navState: NavigationState<PageRoute> = {
            index: this.state.tabIndex,
            routes: [
                {key: 'markets', title: 'Markets'},
                {key: 'events', title: 'Events'},
            ]
        }
        if (event.hasPrematchStatistics) {
            navState.routes.push({key: 'stats', title: 'Statistics'})
        }

        return <TabViewAnimated style={[styles.container]}
                                navigationState={navState}
                                renderScene={this.renderScene}
                                renderFooter={this.renderFooter}
                                onIndexChange={this.handleIndexChange}
                                // useNativeDriver
                                initialLayout={initialLayout}/>

    }

    @autobind
    private handleIndexChange(index: number) {
        this.setState({
            tabIndex: index
        });
    }

    @autobind
    private renderLabel(props: SceneRendererProps<PageRoute>) {
        return (scene: Scene<PageRoute>) => {
            const inputRange = props.navigationState.routes.map((x, i) => i);
            const outputRange = inputRange.map(
                inputIndex => (inputIndex === scene.index ? '#00ADC9' : '#222')
            );
            const color = props.position.interpolate({
                inputRange,
                outputRange,
            });

            return (
                <Animated.Text style={[styles.label, {color}]}>
                    {scene.route.title}
                </Animated.Text>
            );
        }
    }

    @autobind
    private renderFooter(props: SceneRendererProps<PageRoute>) {
        return (
            <TabBar
                {...props}
                pressColor="#00ADC9"
                renderLabel={this.renderLabel(props)}
                indicatorStyle={styles.indicator}
                tabStyle={styles.tab}
                style={styles.tabbar}
            />
        )
    }

    @autobind
    private renderScene(props: SceneRendererProps<PageRoute> & Scene<PageRoute>) {
        const {event, navigation} = this.props

        const {tabIndex} = this.state
        console.log("Route: " + props.route.key + ", current tab index: " + tabIndex)
        switch (props.route.key) {
            case 'events':
                // if (this.state.tabIndex !== 0) return null

                return (
                    <EventLiveStatsView eventId={event.id} eventGroupId={event.groupId} sport={event.sport}
                                        style={styles.liveStats}/>
                );

            case 'markets':
                // if (this.state.tabIndex !== 1) return null

                return (
                    <EventMarketsView eventId={event.id}
                                      live={event.state === "STARTED"}
                                      eventGroupid={event.groupId}
                                      navigation={navigation}/>
                );

            case 'stats':
                // if (this.state.tabIndex !== 2) return null

                return (
                    <EventPrematchStatsView navigation={navigation} eventId={event.id} eventGroupid={event.groupId}/>
                );
            default:
                return null

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    liveStats: {} as ViewStyle,
    indicator: {
        backgroundColor: '#00ADC9',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        height: 2,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        margin: 8,
    },
    tabbar: {
        backgroundColor: '#f9f9f9',
    },
    tab: {
        opacity: 1,
        flex: 1
    },
    page: {
        backgroundColor: '#f9f9f9',
    },
});


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {

    const params = inputProps.navigation.state.params
    const eventId = params.eventId

    return {
        event: state.entityStore.events.get(eventId)
    }
}

export const EventScreen: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(EventScreenComponent)
