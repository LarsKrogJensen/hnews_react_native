import * as React from "react"
import {EventEntity} from "model/EventEntity";
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";

interface Props {
    event: EventEntity
    style?: ViewStyle
    textStyle?: TextStyle
}

export default class EventPathItem extends React.Component<Props> {

    public render() {
        const style: ViewStyle = {
            ...pathStyle,
            ...this.props.style
        }

        return (
            <View style={style}>{this.renderPath(this.props.event)}</View>
        )
    }

    @autobind
    private renderPath(event: EventEntity): JSX.Element[] {
        const pathArray: JSX.Element[] = []
        const textStyle: TextStyle = {
            ...pathEntryStyle,
            ...this.props.textStyle
        }
        const separatorStyle: TextStyle = {
            ...pathSeparatorStyle,
            ...this.props.textStyle
        }

        event.path.forEach((path, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={pathSeparatorStyle}>/</Text>)
            }
            pathArray.push(<Text key={index}
                                 numberOfLines={1}
                                 ellipsizeMode="tail"
                                 style={textStyle}>{path.name}</Text>)
        })
        return pathArray;
    }

}

const pathStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center"
}

const pathEntryStyle: TextStyle = {
    fontSize: 12,
    color: "#717171"
}

const pathSeparatorStyle: TextStyle = {
    ...pathEntryStyle,
    paddingLeft: 4,
    paddingRight: 4
}