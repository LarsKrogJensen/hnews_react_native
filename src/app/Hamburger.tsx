import * as React from "react"
import autobind from "autobind-decorator";
import Icon from "react-native-vector-icons/Ionicons"
import {NavigationScreenProp} from "react-navigation";

export default class Hamburger extends React.Component<{ navigation: NavigationScreenProp<{}, {}> }> {
    render() {
        return (
            <Icon.Button name="ios-menu"
                         size={30}
                         backgroundColor="transparent"
                         iconStyle={{marginLeft: 10}}
                         onPress={this.onClick}/>
        )
    }

    @autobind
    onClick() {
        this.props.navigation.navigate("DrawerOpen")
    }
}