import {StackNavigator, TabNavigator} from "react-navigation"
import HomeScreen from "screens/HomeScreen"
import SportScreen from "screens/SportScreen";
import BetHistoryScreen from "screens/BetHistoryScreen";
import EventScreen from "screens/EventScreen";
import LiveEventsScreen from "containers/LiveEventsScreen";

const HomeTab = StackNavigator({
    Home: {
        screen: HomeScreen,
        path: '/',
        navigationOptions: {
            title: 'HOME'
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}'s Event!`
        })
    }
});

const LiveTab = StackNavigator({
    Sports: {
        screen: LiveEventsScreen,
        path: '/',
        navigationOptions: {
            title: 'LIVE'
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}'s Event!`
        })
    }
});

const SportsTab = StackNavigator({
    Sports: {
        screen: SportScreen,
        path: '/',
        navigationOptions: {
            title: 'SPORTS'
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}'s Event!`
        })
    }
});

const BetHistoryTab = StackNavigator({
    Bets: {
        screen: BetHistoryScreen,
        path: '/n',
        navigationOptions: {
            title: 'BETS'
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}'s Event!`
        })
    }
});

const App = TabNavigator({
        Home: {
            screen: HomeTab,
            path: "/",
            navigationOptions: {
                tabBarLabel: "Home"
            }
        },
        Live: {
            screen: LiveTab,
            path: "/live",
            navigationOptions: {
                tabBarLabel: "LIVE"
            }
        },
        Sport: {
            screen: SportsTab,
            path: "/sports",
            navigationOptions: {
                tabBarLabel: "Sports"
            }
        },
        BetHistory: {
            screen: BetHistoryTab,
            path: "/bets",
            navigationOptions: {
                tabBarLabel: "Bets"
            }
        }
    },
    {
        tabBarPosition: "bottom",
        lazy: true,
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {
            tabStyle: {
                backgroundColor: "#00ADC9"
            }
            // activeTintColor: "#e91e63"
        }
    })

export default App
