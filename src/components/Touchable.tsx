import * as React from "react"
import {TouchableHighlight, TouchableNativeFeedback, ViewStyle} from "react-native";
import {isIos} from "lib/platform";

interface Props {
    style?: ViewStyle,
    onPress?: () => void
}

export default class Touchable extends React.Component<Props> {

    public render() {
        if (isIos()) {
            return <TouchableHighlight {...this.props}>{this.props.children}</TouchableHighlight>
        }

        return <TouchableNativeFeedback {...this.props}>{this.props.children}</TouchableNativeFeedback>
    }

}