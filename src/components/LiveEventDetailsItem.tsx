import * as React from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import FavoriteItem from "components/FavoriteItem";
import {EventEntity} from "model/EventEntity";

interface Props {
    style: ViewStyle,
    event: EventEntity
}

export default class LiveEventDetailsItem extends React.PureComponent<Props> {

    public render() {
        const {event, style} = this.props;
        const viewStyle: ViewStyle = {
            ...style,
            flexDirection: "column"
        }
        return (
            <View style={viewStyle}>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "column", flex: 1}}>
                        <Text numberOfLines={1}
                              ellipsizeMode={"tail"}
                              style={participantStyle}>{event.homeName}</Text>
                        <Text numberOfLines={1}
                              ellipsizeMode={"tail"}
                              style={participantStyle}>{event.awayName}</Text>
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <FavoriteItem eventId={event.id}/>
                    </View>
                    <View style={{justifyContent: "center", minWidth: 48}}>
                        <Text style={{
                            fontSize: 12,
                            padding: 8,
                            color: "#717171",
                            textAlign: "right"
                        }}>+{event.liveBoCount}</Text>
                    </View>
                </View>
                <View style={pathStyle}>{this.renderPath(event)}</View>
            </View>
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

const participantStyle: TextStyle = {
    color: "#202020",
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 16
}

const pathStyle: TextStyle = {
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
