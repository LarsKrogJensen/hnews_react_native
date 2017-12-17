import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import SoonScreen from "screens/StartingSoonScreen"
import {NativeModules} from "react-native";
import EventScreen from "screens/EventScreen";
import Drawer from "app/Drawer";
import SportScreen from "screens/SportScreen";

const HomeStack = StackNavigator({
        Home: {
            screen: HomeScreen,
            path: '/'
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:name'
        }
    },
    {
        headerMode: "none"
    }
);

const LiveStack = StackNavigator({
        Live: {
            screen: LiveScreen,
            path: '/'
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:name'
        }
    },
    {
        headerMode: "none"
    });

const SoonStack = StackNavigator({
        Soon: {
            screen: SoonScreen,
            path: '/'
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:name'
        }
    },
    {
        headerMode: "none"
    });

const SportStack = StackNavigator({
        SportRoot: {
            screen: SportScreen,
            path: '/sport/:sport/:league'
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:id'
        }
    },
    {
        headerMode: "none"
    });

const NavApp = DrawerNavigator(
    {
        Home: {screen: HomeStack},
        Live: {screen: LiveStack},
        Soon: {screen: SoonStack},
        Sport: {screen: SportStack}
    },
    {
        contentComponent: props => <Drawer {...props} />,
        initialRouteName: "Home"
    }
);

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default NavApp;