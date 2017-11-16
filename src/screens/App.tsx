import * as React from "react"
import {Header, NavigationStackScreenOptions, StackNavigator, TabNavigator} from "react-navigation"
import HomeScreen from "screens/HomeScreen"
import SportScreen from "screens/SportScreen";
import BetHistoryScreen from "screens/BetHistoryScreen";
import EventScreen from "screens/EventScreen";
import LiveEventsScreen from "screens/LiveEventsScreen";
import {Image, Platform, StatusBar, StyleSheet, View} from "react-native";
import {isIos} from "lib/device";
import SearchScreen from "screens/SearchScreen";
import CrossPlatformIcon from "components/CrossPlatformIcon";
import banner from "images/banner";
import absoluteFill = StyleSheet.absoluteFill;

const defaultNavOptions: NavigationStackScreenOptions = {
    headerTintColor: 'white',
    headerTitleStyle: {color: 'white'},
    headerBackTitleStyle: {color: 'white'},
    headerStyle: {
        backgroundColor: "transparent"
    },
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

const SearchTab = StackNavigator({
    Search: {
        screen: SearchScreen,
        path: '/',
        navigationOptions: {
            ...defaultNavOptions,
            title: "Search"
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
            headerMode: "none"
        }
    },
    Event: {
        screen: EventScreen,
        path: '/liveEvent/:name',
        navigationOptions: {
            headerMode: "none"
        }
    }
});

const App = TabNavigator({
        Home: {
            screen: HomeTab,
            path: "/",
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: iconResolver("home")
            }
        },
        Live: {
            screen: LiveTab,
            path: "/live",
            navigationOptions: {
                tabBarLabel: "Live",
                tabBarIcon: iconResolver("timer")
            }
        },
        Sport: {
            screen: SportsTab,
            path: "/sports",
            navigationOptions: {
                tabBarLabel: "Sports",
                tabBarIcon: iconResolver("football")
            }
        },
        Search: {
            screen: SearchTab,
            path: "/search",
            navigationOptions: {
                tabBarLabel: "Search",
                tabBarIcon: iconResolver("search")
            }
        },
        BetHistory: {
            screen: BetHistoryTab,
            path: "/bets",
            navigationOptions: {
                tabBarLabel: "Bets",
                tabBarIcon: iconResolver("home")
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
                backgroundColor: Platform.select({android: () => "#00ADC9"})()
            },
            style: {
                backgroundColor: Platform.select({android: () => "black"})()
            },
            showIcon: true,
            showLabel: isIos(),
            activeTintColor: Platform.select({ios: () => "#00ADC9", android: () => "white"})()
        }
    })

function iconResolver(icon: string) {
    return ({focused, tintColor}) => {
        return <CrossPlatformIcon name={icon} size={30} color={tintColor} outline={focused}/>
    }
}

// http://www.deltasport.tv/media/1001/banner.jpg
// https://www.partyrama.co.uk/wp-content/uploads/2014/02/PBANN-olympics0061.jpg
// source={{uri: "https://www.partyrama.co.uk/wp-content/uploads/2014/02/PBANN-olympics0061.jpg"}}

const ImageHeader = props => (
    <View style={{backgroundColor: '#eee'}}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
        <Image
            style={absoluteFill}
            source={{uri: banner}}
        />
        <Header {...props} style={{
            backgroundColor: 'transparent',
            marginTop: Platform.select({ios: () => 0, android: () => 24})()
        }}/>
    </View>
);

export default App
