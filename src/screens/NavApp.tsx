import * as React from "react"
import {DrawerNavigator, NavigationScreenProp} from "react-navigation";
import HomeScreen from "screens/HomeScreen"
import LiveScreen from "screens/LiveEventsScreen"
import {Button, View} from "react-native";

const NavApp = DrawerNavigator(
    {
        Home: {screen: HomeScreen},
        Live: {screen: LiveScreen}
    },
    {
        contentComponent: props => <SideBar {...props} />
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

export default NavApp;