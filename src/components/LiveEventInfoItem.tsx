import * as React from "react"
import {View, ViewStyle} from "react-native";
import LiveEventScoreItem from "components/LiveEventScoreItem";
import LiveEventDetailsItem from "components/LiveEventDetailsItem";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {ComponentClass} from "react";
import {connect} from "react-redux";
import {LiveData} from "api/typings";


interface ExternalProps {
    eventId: number,
    viewStyle: ViewStyle
}

interface StateProps {
    event: EventEntity
    liveData: LiveData
}

type Props = StateProps & ExternalProps

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

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId)
})


const WithData: ComponentClass<ExternalProps> = connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveEventInfoItem)

export default WithData