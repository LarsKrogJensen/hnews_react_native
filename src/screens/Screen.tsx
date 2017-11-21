import * as React from "react"
import {Image, StatusBar, StyleSheet, View} from "react-native";
import {Toolbar} from "react-native-material-ui";
import {NavigationScreenProp} from "react-navigation";
import autobind from "autobind-decorator";
import banner from "images/banner";
import absoluteFill = StyleSheet.absoluteFill;

interface Props {
    title: string
    rootScreen?: boolean
    navigation: NavigationScreenProp<{}, {}>
}

export default class Screen extends React.Component<Props> {

    render() {
        return (
            <View>
                <View>
                    <StatusBar backgroundColor="transparent" translucent/>
                    <View style={{backgroundColor: "transparent", height: 24}}/>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Toolbar leftElement={this.leftMenuIcon()}
                             onLeftElementPress={this.onLeftClick}
                             centerElement={this.props.title}
                             searchable={{
                                 autoFocus: true,
                                 placeholder: 'Search'
                             }}
                    />
                </View>
                {this.props.children}
            </View>
        )
    }

    @autobind
    private onLeftClick() {
        const {navigation, rootScreen} = this.props;
        if (rootScreen) {
            navigation.navigate("DrawerOpen")
        } else {
            navigation.goBack()
        }
    }

    @autobind
    private leftMenuIcon() {
        const {rootScreen} = this.props;
        if (rootScreen) {
            return "menu"
        } else {
            return "arrow-back"
        }
    }
}