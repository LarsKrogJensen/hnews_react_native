import * as React from "react"
import {LiveEvent} from "api/typings";
import {Text, TextStyle, View, ViewStyle} from "react-native";

interface Props {
    style: ViewStyle,
    liveEvent: LiveEvent
}

export default class LiveEventDetailsItem extends React.Component<Props> {
    private participantStyle: TextStyle = {
        color: "#202020",
        fontSize: 16,
        fontWeight: "400",
        paddingLeft: 16
    }
    private pathStyle: TextStyle = {fontSize: 12, color: "#717171"}
    private pathSepStyle: TextStyle = {...this.pathStyle, paddingLeft: 4, paddingRight: 4}


    constructor(props: Props, context: any) {
        super(props, context);
        this.renderPath = this.renderPath.bind(this);
    }

    public render() {
        const {liveEvent, style} = this.props;
        const viewStyle: ViewStyle = {
            ...this.props.style,
            flexDirection: "row"
        }

        return (
            <View style={viewStyle}>
                <View style={{flex: 1}}>
                    <Text numberOfLines={1}
                          ellipsizeMode={"tail"}
                          style={this.participantStyle}>{liveEvent.event.homeName}</Text>
                    <Text numberOfLines={1}
                          ellipsizeMode={"tail"}
                          style={this.participantStyle}>{liveEvent.event.awayName}</Text>
                    <View style={{paddingLeft: 16, flex: 1, flexDirection: "row", marginTop: 4}}>{this.renderPath(liveEvent)}</View>
                </View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{padding: 8, color: "#717171"}}>FAV</Text>
                </View>
                <View style={{justifyContent: "center"}}>
                    <Text style={{fontSize: 12, padding: 8, color: "#717171"}}>+{liveEvent.event.liveBoCount}</Text>
                </View>
            </View>
        )
    }

    private renderPath(liveEvent: LiveEvent) {
        const pathArray = []
        liveEvent.event.path.forEach((path, index) => {
            if (index > 0) {
                pathArray.push(<Text key={index + "sep"} style={this.pathSepStyle}>/</Text>)
            }
            pathArray.push(<Text key={index} numberOfLines={1} ellipsizeMode="tail" style={this.pathStyle}>{path.name}</Text>)
        })
        return pathArray;
    }
}