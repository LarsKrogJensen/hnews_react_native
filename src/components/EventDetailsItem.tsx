import * as React from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import FavoriteItem from "components/FavoriteItem";
import {EventEntity} from "model/EventEntity";
import EventPathItem from "components/EventPathItem";
import {LiveData} from "api/typings";
import {renderServe} from "components/RenderUtils";

interface Props {
    style: ViewStyle
    event: EventEntity
    liveData: LiveData
}

export default class EventDetailsItem extends React.PureComponent<Props> {

    public render() {
        const {event, style, liveData} = this.props;
        const viewStyle: ViewStyle = {
            ...style,
            flexDirection: "column"
        }
        const homeServe = renderServe(liveData, true);
        let awayServe = renderServe(liveData, false);
        return (
            <View style={viewStyle}>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "column", flex: 1}}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {homeServe}
                            <Text numberOfLines={1}
                                  ellipsizeMode={"tail"}
                                  style={[participantStyle, {paddingLeft: homeServe ? 0 : 16}]}>{event.homeName}</Text>
                        </View>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            {awayServe}
                            <Text numberOfLines={1}
                                  ellipsizeMode={"tail"}
                                  style={[participantStyle, {paddingLeft: awayServe ? 0 : 16}]}>{event.awayName}</Text>
                        </View>
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
    paddingLeft: 0
}

