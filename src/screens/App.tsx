import * as React from "react"
import {Header, NavigationStackScreenOptions, StackNavigator, TabNavigator} from "react-navigation"
import HomeScreen from "screens/HomeScreen"
import SportScreen from "screens/SportScreen";
import BetHistoryScreen from "screens/BetHistoryScreen";
import EventScreen from "screens/EventScreen";
import LiveEventsScreen from "containers/LiveEventsScreen";
import {Image, Platform, StatusBar, StyleSheet, View} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import {isIos} from "lib/platform";
import absoluteFill = StyleSheet.absoluteFill;

const defaultNavOptions: NavigationStackScreenOptions = {
    headerTintColor: 'white',
    headerTitleStyle: {color: '#fff'},
    headerBackTitleStyle: {color: '#fff'},
    header: (props) => <ImageHeader {...props} />
}
const HomeTab = StackNavigator({
    Home: {
        screen: HomeScreen,
        path: '/',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Home"
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Event"

        }
    }
});

const LiveTab = StackNavigator({
    Sports: {
        screen: LiveEventsScreen,
        path: '/',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Live"
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Event"
        }
    }
});

const SportsTab = StackNavigator({
    Sports: {
        screen: SportScreen,
        path: '/',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Sports"
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Event"
        }
    }
});

const BetHistoryTab = StackNavigator({
    Bets: {
        screen: BetHistoryScreen,
        path: '/n',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Bets"
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Event"
        }
    }
});

const App = TabNavigator({
        Home: {
            screen: HomeTab,
            path: "/",
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: iconResolver("ios-home")
            }
        },
        Live: {
            screen: LiveTab,
            path: "/live",
            navigationOptions: {
                tabBarLabel: "Live",
                tabBarIcon: iconResolver("ios-timer")
            }
        },
        Sport: {
            screen: SportsTab,
            path: "/sports",
            navigationOptions: {
                tabBarLabel: "Sports",
                tabBarIcon: iconResolver("ios-home")
            }
        },
        BetHistory: {
            screen: BetHistoryTab,
            path: "/bets",
            navigationOptions: {
                tabBarLabel: "Bets",
                tabBarIcon: iconResolver("ios-home")
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
                backgroundColor: Platform.select({android: () => "#00ADC9", ios: () => undefined})()
            },
            style: {
                backgroundColor: Platform.select({android: () => "black", ios: () => undefined})()
            },
            showIcon: true,
            showLabel: isIos(),
            activeTintColor: Platform.select({ios: () => "#00ADC9", android: () => "white"})()
        }
    })

function iconResolver(icon: string) {
    return ({focused, tintColor}) => {
        let iconName = icon;
        if (!focused) {
            iconName += "-outline"
        }
        return <Icon name={iconName} size={30} color={tintColor}/>
    }
}

const ImageHeader = props => (
    <View style={{backgroundColor: '#eee'}}>
        <StatusBar translucent backgroundColor="transparent"/>
        <Image
            style={absoluteFill}
            source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Hopetoun_falls.jpg'}}
        />
        <Header {...props} style={{backgroundColor: 'transparent', marginTop: 24}}/>
    </View>
);

StatusBar.setBarStyle("light-content")
// StatusBar.setTranslucent(true);


export default App
