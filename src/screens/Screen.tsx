import * as React from "react"
import {Image, StatusBar, StyleSheet, View} from "react-native";
import {Toolbar} from "react-native-material-ui";
import {NavigationScreenProp} from "react-navigation";
import banner from "images/banner";
import {Orientation, orientation} from "lib/device";
import {navigateBack, navigateDrawerOpen} from "lib/navigate";
import absoluteFill = StyleSheet.absoluteFill;

interface Props {
    title: string | JSX.Element
    rootScreen?: boolean
    navigation: NavigationScreenProp<{}>
}

interface State {
    orientation: Orientation
}

export class Screen extends React.Component<Props, State> {

    constructor(props: Props, context: any) {
        super(props, context);
        this.state = {
            orientation: orientation()
        }
    }

    render() {
        return (
            <View style={{flexDirection: "column", flex: 1}}>
                <View>
                    <StatusBar backgroundColor="transparent" translucent/>
                    <View style={{backgroundColor: "transparent", height: 24}}/>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Toolbar leftElement={this.leftMenuIcon()}
                             onLeftElementPress={this.onLeftClick}
                             centerElement={this.props.title}
                             style={{
                                 centerElementContainer: {
                                     flex: 1,
                                     marginLeft: 0,
                                 }
                             }}
                    />
                </View>
                <View style={{flex: 1}}>
                    {this.props.children}
                </View>
            </View>
        )
    }

    private onLeftClick = () => {
        const {navigation, rootScreen} = this.props;
        if (rootScreen) {
            navigateDrawerOpen(navigation)
        } else {
            navigateBack(navigation)
        }
    }

    private leftMenuIcon = () => {
        const {rootScreen} = this.props;
        if (rootScreen) {
            return "menu"
        } else {
            return "arrow-back"
        }
    }
}