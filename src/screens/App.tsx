import * as React from "react"
import {StackNavigator, TabNavigator} from "react-navigation"
import HomeScreen from "screens/HomeScreen"
import SportScreen from "screens/SportScreen";
import BetHistoryScreen from "screens/BetHistoryScreen";
import EventScreen from "screens/EventScreen";
import LiveEventsScreen from "containers/LiveEventsScreen";
import {Image, Platform} from "react-native";

function iconResolver(icon: string) {
    return ({focused, tintColor}) => {
        // BUG in RN: https://github.com/realm/realm-js/issues/1342
        // const imageName = focused ?  `../images/${icon}_filled.png` : `../images/${icon}_outline.png`
        // const image = require(imageName)
        let image: any
        if (icon === "home")
            image = focused ? require("../images/home_filled.png") : require("../images/home_outline.png")
        else if (icon === "live")
            image = focused ? require("../images/clock_filled.png") : require("../images/clock_outline.png")

        return <Image source={image} style={{tintColor}}/>
    }
}

const HomeTab = StackNavigator({
    Home: {
        screen: HomeScreen,
        path: '/',
        navigationOptions: {
            title: 'HOME',
            tabBarIcon: iconResolver("home")
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
            title: 'LIVE RIGHT NOW',
            tabBarIcon: iconResolver("live")
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
                tabBarLabel: "Bets",
            }
        }
    },
    {
        tabBarPosition: "bottom",
        animationEnabled: false,
        swipeEnabled: false,
        lazy: true,
        tabBarOptions: {
            tabStyle: {
                backgroundColor: "#00ADC9"
            },
            activeTintColor: Platform.select({ios: () => "#00ADC9", android: () => "white"})()
        }
    })

export default App
