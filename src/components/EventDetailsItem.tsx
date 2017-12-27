import * as React from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import FavoriteItem from "components/FavoriteItem";
import {EventEntity} from "model/EventEntity";
import EventPathItem from "components/EventPathItem";

interface Props {
    style: ViewStyle,
    event: EventEntity
}

export default class EventDetailsItem extends React.PureComponent<Props> {

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
                        <EventPathItem event={event} style={{paddingLeft: 16, marginTop: 2}}/>
                    </View>
                    <View style={{justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                        <FavoriteItem eventId={event.id} style={{justifyContent: "center"}}/>
                        <Text style={{
                            minWidth: 48,
                            fontSize: 12,
                            padding: 8,
                            color: "#717171",
                            textAlign: "right"
                        }}>+{event.liveBoCount || event.nonLiveBoCount}</Text>
                    </View>
                </View>

            </View>
        )
    }
}
const participantStyle: TextStyle = {
    color: "#202020",
    fontSize: 16,
    fontWeight: "400",
    paddingLeft: 16
}

