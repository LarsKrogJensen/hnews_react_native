import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import SoonScreen from "screens/StartingSoonScreen"
import {NativeModules} from "react-native";
import EventScreen from "screens/EventScreen";
import Drawer from "app/Drawer";

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
        Live: {
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

const NavApp = DrawerNavigator(
    {
        Home: {screen: HomeStack},
        Live: {screen: LiveStack},
        Soon: {screen: SoonStack}
    },
    {
        contentComponent: props => <Drawer {...props} />,
        initialRouteName: "Home"
    }
);

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default NavApp;