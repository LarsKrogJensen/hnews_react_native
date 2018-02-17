import * as React from "react"
import {DrawerNavigator, StackNavigator} from "react-navigation";
import {HomeScreen} from "screens/HomeScreen"
import {LiveRightNowScreen} from "screens/LiveRightNowScreen"
import {StartingSoonScreen} from "screens/StartingSoonScreen"
import {EventScreen} from "screens/EventScreen";
import {Drawer} from "app/Drawer";
import {TabbedSportScreen} from "screens/TabbedSportScreen";


const HomeStack = StackNavigator({
        Hemma: {screen: HomeScreen},
        Event: {screen: EventScreen},
    },
    {
        headerMode: "none"
    }
)

const LiveStack = StackNavigator({
        Live: {screen: LiveRightNowScreen},
        Event: {screen: EventScreen},
    },
    {
        headerMode: "none"
    });

const SoonStack = StackNavigator({
        Soon: {screen: StartingSoonScreen},
        Event: {screen: EventScreen},
        // Sport: {screen: SportsMockScreen},
    },
    {
        headerMode: "none"
    }
)

const SportStack = StackNavigator({
        Spring: {screen: TabbedSportScreen},
        Event: {screen: EventScreen}
    },
    {
        headerMode: "none"
    }
)

export const NavApp = DrawerNavigator(
    {
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
)
