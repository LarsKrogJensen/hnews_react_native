import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import SoonScreen from "screens/StartingSoonScreen"
import {NativeModules} from "react-native";
import EventScreen from "screens/EventScreen";
import Drawer from "app/Drawer";
import {SportsScreen} from "screens/SportScreen";
import {mapNavParamsToProps} from "lib/mapNavParamsToProps";

const HomeStack = StackNavigator({
        Home: {screen: HomeScreen},
        Event: {screen: EventScreen}
    },
    {
        headerMode: "none"
    }
);

const LiveStack = StackNavigator({
        Live: {screen: LiveScreen},
        Event: {screen: EventScreen}
    },
    {
        headerMode: "none"
    });

const SoonStack = StackNavigator({
        Soon: {screen: SoonScreen},
        Event: {screen: EventScreen}
    },
    {
        headerMode: "none"
    });

const SportStack = StackNavigator({
        SportRoot: {screen: mapNavParamsToProps(SportsScreen)},
        Event: {screen: EventScreen}
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