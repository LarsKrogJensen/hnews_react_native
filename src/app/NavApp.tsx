import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import SoonScreen from "screens/StartingSoonScreen"
import {NativeModules} from "react-native";
import {EventScreen} from "screens/EventScreen";
import {Drawer} from "app/Drawer";
import {CollapsableScreen2} from "screens/CollapsableScreen2";
import {TopBarDemo2} from "screens/TabBarDemo2";
import {TabbedSportScreen} from "screens/TabbedSportScreen";


const HomeStack = StackNavigator({
        Hemma: {screen: HomeScreen},
        Event: {screen: EventScreen},
        // Sport: {screen: SportsMockScreen}
    },
    {
        headerMode: "none"
    }
);

const LiveStack = StackNavigator({
        Live: {screen: LiveScreen},
        Event: {screen: EventScreen},
        // Sport: {screen: SportsMockScreen}
    },
    {
        headerMode: "none"
    });

const SoonStack = StackNavigator({
        Soon: {screen: SoonScreen},
        Event: {screen: EventScreen},
        // Sport: {screen: SportsMockScreen},
    },
    {
        headerMode: "none"
    });

const SportStack = StackNavigator({
        Spring: {screen: TabbedSportScreen},
        Event: {screen: EventScreen}
    },
    {
        headerMode: "none"
    });

const NavApp = DrawerNavigator(
    {
        Test: {
            screen: TopBarDemo2
        },
        Test2: {
            screen: CollapsableScreen2
        },
        Home: {
            screen: HomeStack
        },
        Live: {
            screen: LiveStack
        },
        Soon: {
            screen: SoonStack
        },
        Sport: {
            screen: SportStack
        }
    },
    {
        contentComponent: Drawer,
        drawerWidth: 300,
        initialRouteName: "Home",
    }
);

const {UIManager} = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default NavApp;