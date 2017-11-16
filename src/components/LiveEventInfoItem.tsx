import * as React from "react"
import {View, ViewStyle} from "react-native";
import LiveEventScoreItem from "components/LiveEventScoreItem";
import LiveEventDetailsItem from "components/LiveEventDetailsItem";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {ComponentClass} from "react";
import {connect} from "react-redux";
import {LiveData} from "api/typings";

interface Props {
    event: EventEntity,
    liveData: LiveData,
    viewStyle: ViewStyle
}

class LiveEventInfoItem extends React.PureComponent<Props> {
    public render() {
        const {event, liveData, viewStyle} = this.props;
        return (
            <View style={{...viewStyle, flexDirection: "row", flex: 1, height: 68}}>
                <LiveEventScoreItem style={{width: 68}}
                                    sport={event.sport}
                                    liveData={liveData}/>
                <LiveEventDetailsItem style={{flex: 1}}
                                      event={event}/>
            </View>
        )
    }
}

interface PropsIn {
    eventId: number,
    viewStyle: ViewStyle
}

const mapStateToProps = (state: AppStore, inputProps: PropsIn) => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId),
    viewStyle: inputProps.viewStyle
})


const WithData: ComponentClass<PropsIn> = connect<Props, {}, PropsIn>(mapStateToProps)(LiveEventInfoItem)

export default WithData