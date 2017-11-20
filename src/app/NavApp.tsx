import * as React from "react"
import {DrawerNavigator, Header, NavigationStackScreenOptions, StackNavigator} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import {Image, Platform, StatusBar, StyleSheet, View} from "react-native";
import EventScreen from "screens/EventScreen";
import banner from "images/banner";
import Hamburger from "app/Hamburger";
import Drawer from "app/Drawer";
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
            navigationOptions: (props) => {
                return {
                    title: "Home",
                    headerLeft: <Hamburger {...props} />
                }
            }
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:name',
            navigationOptions: {
                title: "Event"

            }
        }
    },
    {
        navigationOptions: defaultNavOptions
    }
);

const LiveTab = StackNavigator({
        Live: {
            screen: LiveScreen,
            path: '/',
            navigationOptions: (props) => {
                return {
                    title: "Live Right Now",
                    headerLeft: <Hamburger {...props} />
                }
            }
        },
        Event: {
            screen: EventScreen,
            path: '/liveEvent/:name',
            navigationOptions: {
                title: "Event"

            }
        }
    },
    {
        navigationOptions: defaultNavOptions
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


export default NavApp;