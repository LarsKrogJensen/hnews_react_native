import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import {NativeModules, StatusBar, StyleSheet} from "react-native";
import EventScreen from "screens/EventScreen";
import Drawer from "app/Drawer";

const HomeTab = StackNavigator({
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

const LiveTab = StackNavigator({
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

const NavApp = DrawerNavigator(
    {
        Home: {screen: HomeTab},
        Live: {screen: LiveTab}
    },
    {
        contentComponent: props => <Drawer {...props} />,
        initialRouteName: "Home"
    }
);


const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
// StatusBar.setTranslucent(false)
// StatusBar.setBackgroundColor("green")

export default NavApp;