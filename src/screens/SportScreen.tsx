import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {SportView} from "views/SportView";
import {CollapsableHeaderScreen, ScrollHooks} from "screens/CollapsableHeaderScreen";
import autobind from "autobind-decorator";
import {NavigationState, RouteBase, Scene, SceneRendererProps, TabBar, TabViewAnimated} from "react-native-tab-view";
import {Animated, Dimensions, StyleSheet, ViewStyle} from "react-native";

interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
}

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
}

interface State {
    navState: NavigationState<PageRoute>
}

interface PageRoute extends RouteBase {
    title: string
    //key: "matches" | "competitions"
}

export class SportScreen extends React.Component<ExternalProps, State> {

    state = {
        navState: {
            index: 0,
            routes: [
                {key: 'matches', title: 'In-play & Upcoming'},
                {key: 'competitions', title: 'Outrights'},
            ]
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ExternalProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        const {navigation: {state: {params}}} = this.props;
        const {navigation: {state: {params: nextParams}}} = nextProps;

        if (nextParams.region !== params.region) return true
        if (nextParams.sport !== params.sport) return true
        if (nextParams.league !== params.league) return true

        return false
    }

    render(): React.ReactNode {
        const {navigation, navigation: {state: {params}}} = this.props;

        return (
            <CollapsableHeaderScreen title={params.group.name}
                                     rootScreen={true}
                                     navigation={navigation}
                                     renderBody={this.renderBody}
            />
        )
    }

    @autobind
    private renderBody(scrollHooks: ScrollHooks) {
        return (
            <TabViewAnimated style={[styles.container]}
                             navigationState={this.state.navState}
                             renderScene={this.renderScene(scrollHooks)}
                             renderFooter={this.renderFooter}
                             onIndexChange={this.handleIndexChange}
                             // useNativeDriver
                             initialLayout={initialLayout}/>
        )
    }

    @autobind
    private handleIndexChange(index: number) {
        this.setState(prevState => (
            {
                navState: {
                    index,
                    routes: prevState.navState.routes
                }
            }
        ));
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
    private renderScene(scrollHooks: ScrollHooks) {
        return (props: SceneRendererProps<PageRoute> & Scene<PageRoute>) => {
            const {navigation, navigation: {state: {params}}} = this.props;

            const {navState} = this.state
            console.log("Route: " + props.route.key + ", current tab index: " + navState.index)

            return (
                <SportView navigation={navigation}
                           scrollHooks={scrollHooks}
                           sport={params.sport}
                           region={params.region}
                           league={params.league}
                           filter={props.route.key === "matches" ? "matches" : "competitions"}
                />
            )
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