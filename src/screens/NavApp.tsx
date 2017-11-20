import * as React from "react"
import {
    DrawerNavigator,
    Header,
    NavigationScreenProp,
    NavigationStackScreenOptions,
    StackNavigator
} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import {Button, Image, Platform, StatusBar, StyleSheet, View} from "react-native";
import EventScreen from "screens/EventScreen";
import banner from "images/banner";
import CrossPlatformIcon from "components/CrossPlatformIcon";
import absoluteFill = StyleSheet.absoluteFill;
import autobind from "autobind-decorator";

const defaultNavOptions: NavigationStackScreenOptions = {
    headerTintColor: 'white',
    headerTitleStyle: {color: 'white'},
    headerBackTitleStyle: {color: 'white'},
    headerStyle: {
        backgroundColor: "transparent"
    },
    header: (props) => <ImageHeader {...props} />
}


class Hamburger extends React.Component {
    render() {
        return (
            <Button title="menu" onPress={this.onClick}/>
        )
        {/*<Touchable onPress={() => console.log(this.props)} style={{paddingLeft: 16}}>*/
        }
        {/*<CrossPlatformIcon name="menu" size={30} color="white"/>*/
        }
        {/*</Touchable>*/
        }
    }

    @autobind
    onClick() {
         console.log("clclclcl")
    }
}

const HomeTab = StackNavigator({
        Home: {
            screen: HomeScreen,
            path: '/',
            navigationOptions: {
                title: "none",
                headerLeft: <Hamburger/>
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
            navigationOptions: {
                title: "Live right now"
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
        Home: {
            screen: HomeTab,
            navigationOptions: {
                headerMode: "none"
            }
        },
        Live: {screen: LiveTab}
    },
    {
        contentComponent: props => <SideBar {...props} />,
        initialRouteName: "Home"
    }
);


interface SideBarProps {
    navigation: NavigationScreenProp<{}, {}>
}

class SideBar extends React.Component<SideBarProps> {

    render() {
        return <View>
            <Button
                onPress={() => this.props.navigation.navigate('Home')}
                title="Go to Home"
            />
            <Button
                onPress={() => this.props.navigation.navigate('Live')}
                title="Go to Live"
            />
        </View>
    }
}

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

function iconResolver(icon: string) {
    return ({tintColor, focused}) => {
        return <CrossPlatformIcon name={icon} size={30} color={tintColor} outline={focused}/>
    }
}


export default NavApp;