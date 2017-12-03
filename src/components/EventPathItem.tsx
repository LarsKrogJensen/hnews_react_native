import * as React from "react"
import {EventEntity} from "model/EventEntity";
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";

interface Props {
    event: EventEntity,
    style?: ViewStyle
}

export default class EventPathItem extends React.Component<Props> {

    public render() {
        const style: ViewStyle = {
            ...this.props.style,
            ...pathStyle
        }

        return (
            <View style={style}>{this.renderPath(this.props.event)}</View>
        )
    }

    @autobind
    private renderPath(event: EventEntity): JSX.Element[] {
        const pathArray: JSX.Element[] = []
        event.path.forEach((path, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={pathSeparatorStyle}>/</Text>)
            }
            pathArray.push(<Text key={index}
                                 numberOfLines={1}
                                 ellipsizeMode="tail"
                                 style={pathEntryStyle}>{path.name}</Text>)
        })
        return pathArray;
    }

}

const pathStyle: ViewStyle = {
    flex: 1,
    paddingLeft: 16,
    flexDirection: "row",
    marginTop: 4
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