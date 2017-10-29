import * as React from "react"
import {LiveEvent} from "api/typings";
import {Text, TextStyle, View, ViewStyle} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import autobind from "autobind-decorator";
import ActionDelegate from "store/ActionDelegate";
import Touchable from "components/Touchable";

interface Props {
    style: ViewStyle,
    liveEvent: LiveEvent,
    actions: ActionDelegate
}

export default class LiveEventDetailsItem extends React.Component<Props> {

    public render() {
        const {liveEvent, style, actions} = this.props;
        const viewStyle: ViewStyle = {
            ...style,
            flexDirection: "column"
        }
        const isFav = actions.isFavorite(liveEvent.event.id)
        return (
            <View style={viewStyle}>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "column", flex: 1}}>
                        <Text numberOfLines={1}
                              ellipsizeMode={"tail"}
                              style={participantStyle}>{liveEvent.event.homeName}</Text>
                        <Text numberOfLines={1}
                              ellipsizeMode={"tail"}
                              style={participantStyle}>{liveEvent.event.awayName}</Text>
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Touchable onPress={() => actions.toggleFavorite(liveEvent.event.id)}>
                            <Icon style={{padding: 0}}
                                  name={isFav ? "ios-star" : "ios-star-outline"}
                                  size={30}
                                  color={isFav ? "darkorange" : "#717171"} />
                        </Touchable>
                    </View>
                    <View style={{justifyContent: "center"}}>
                        <Text style={{fontSize: 12, padding: 8, color: "#717171"}}>+{liveEvent.event.liveBoCount}</Text>
                    </View>
                </View>
                <View style={pathStyle}>{this.renderPath(liveEvent)}</View>
            </View>
        )
    }

    @autobind
    private renderPath(liveEvent: LiveEvent): JSX.Element[] {
        const pathArray: JSX.Element[] = []
        liveEvent.event.path.forEach((path, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={pathSeparatorStyle}>/</Text>)
            }
            pathArray.push(<Text key={index} numberOfLines={1} ellipsizeMode="tail"
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
