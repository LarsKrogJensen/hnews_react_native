import * as React from "react"
import {LiveEvent} from "api/typings";
import {View} from "react-native";
import LiveEventScoreItem from "components/LiveEventScoreItem";
import LiveEventDetailsItem from "components/LiveEventDetailsItem";

interface Props {
    liveEvent: LiveEvent
}

export default class LiveEventInfoItem extends React.Component<Props> {
    public render() {
        const liveEvent = this.props.liveEvent;
        return (
            <View style={{flexDirection: "row", flex: 1, height: 68}}>
                <LiveEventScoreItem style={{width: 68}}
                                    sport={liveEvent.event.sport}
                                    liveData={liveEvent.liveData}/>
                <LiveEventDetailsItem style={{flex: 1}}
                                      liveEvent={liveEvent}/>
            </View>
        )
    }
}