import * as React from "react"
import {TouchableHighlight, TouchableNativeFeedback, View, ViewStyle} from "react-native";
import {isIos} from "lib/device";

interface Props {
    style?: ViewStyle | ViewStyle[],
    onPress?: () => void
}

export default class Touchable extends React.Component<Props> {

    public render() {
        if (isIos()) {
            return <TouchableHighlight {...this.props}>{this.props.children}</TouchableHighlight>
        }

        // TouchableNativeFeedback does not accept styles so we need to wrap it
        return (
            <View  style={this.props.style}>
                <TouchableNativeFeedback onPress={this.props.onPress}>
                    {this.props.children}
                </TouchableNativeFeedback>
            </View>
        )
    }

}