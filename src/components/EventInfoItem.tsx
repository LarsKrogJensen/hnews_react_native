import * as React from "react"
import {ComponentClass} from "react"
import {View, ViewStyle} from "react-native";
import EventScoreItem from "components/EventScoreItem";
import EventDetailsItem from "components/EventDetailsItem";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {LiveData} from "api/typings";
import EventTimeItem from "components/EventTimeItem";
import {Theme} from "lib/device";


interface ExternalProps {
    eventId: number,
    viewStyle: ViewStyle,
    theme: Theme
    showFavorites?: boolean
}

interface StateProps {
    event: EventEntity
    liveData: LiveData
}

type Props = StateProps & ExternalProps

class EventInfoItemComponent extends React.PureComponent<Props> {
    public render() {
        const {event, liveData, viewStyle, theme, showFavorites} = this.props;

        if (!event) {
            return <View style={[{flexDirection: "row"}, viewStyle]}/>
        }

        return (
            <View style={[{flexDirection: "row"}, viewStyle]}>
                {this.renderScoreOrTime(event, liveData)}
                <EventDetailsItem style={{flex: 1}}
                                  event={event}
                                  liveData={liveData}
                                  theme={theme}
                                  showFavorites={showFavorites}/>
            </View>
        )
    }

    private renderScoreOrTime(event: EventEntity, liveData: LiveData) {
        const style: ViewStyle = {width: 68}
        const startTime = new Date(event.start)
        const now: Date = new Date()

        if (liveData && now > startTime) {
            return (
                <EventScoreItem style={style}
                                sport={event.sport}
                                theme={this.props.theme}
                                liveData={liveData}/>
            )
        }

        return <EventTimeItem event={event} style={style}/>
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId)
})


export const EventInfoItem: ComponentClass<ExternalProps> = connect<StateProps, {}, ExternalProps>(mapStateToProps)(EventInfoItemComponent)
