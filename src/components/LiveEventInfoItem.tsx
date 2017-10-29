import * as React from "react"
import {LiveEvent} from "api/typings";
import {View, ViewStyle} from "react-native";
import LiveEventScoreItem from "components/LiveEventScoreItem";
import LiveEventDetailsItem from "components/LiveEventDetailsItem";
import ActionDelegate from "store/ActionDelegate";

interface Props {
    liveEvent: LiveEvent,
    viewStyle: ViewStyle
}

export default class LiveEventInfoItem extends React.PureComponent<Props> {
    public render() {
        const {liveEvent, viewStyle} = this.props;
        return (
            <View style={{...viewStyle, flexDirection: "row", flex: 1, height: 68}}>
                <LiveEventScoreItem style={{width: 68}}
                                    sport={liveEvent.event.sport}
                                    liveData={liveEvent.liveData}/>
                <LiveEventDetailsItem style={{flex: 1}}
                                      liveEvent={liveEvent}/>
            </View>
        )
    }
}