import * as React from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {Path} from "api/typings";
import {Theme} from "lib/device";

interface Props {
    path: ReadonlyArray<Path>
    style?: ViewStyle
    textStyle?: TextStyle
    theme?: Theme
}

export default class EventPathItem extends React.Component<Props> {

    public render() {
        return (
            <View style={[styles.path, this.props.style]}>{this.renderPath(this.props.path)}</View>
        )
    }

    @autobind
    private renderPath(path: ReadonlyArray<Path>): JSX.Element[] {
        const pathArray: JSX.Element[] = []

        path.map((p, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={[styles.entry, styles.divider, this.props.textStyle]}>/</Text>)
            }
            pathArray.push(<Text key={index}
                                 numberOfLines={1}
                                 ellipsizeMode="tail"
                                 style={[styles.entry, this.props.textStyle]}>{p.name}</Text>)
        })
        return pathArray;
    }

}

const styles = StyleSheet.create({
    path: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    entry: {
        fontSize: 12,
        color: "#717171",
        flexShrink: 1
    } as TextStyle,
    divider: {
        paddingLeft: 4,
        paddingRight: 4
    } as TextStyle
})
