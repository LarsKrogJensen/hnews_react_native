import * as React from "react"
import {ComponentClass} from "react"
import {View, ViewStyle} from "react-native";
import {EventScoreItem} from "components/event/EventScoreItem";
import {EventDetailsItem} from "components/event/EventDetailsItem";
import {EventEntity} from "entity/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import EventTimeItem from "components/event/EventTimeItem";

interface ExternalProps {
    eventId: number,
    viewStyle: ViewStyle,
    showFavorites?: boolean
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class EventInfoItemComponent extends React.PureComponent<Props> {
    public render() {
        const {event, viewStyle, showFavorites} = this.props;

        if (!event) {
            return <View style={[{flexDirection: "row"}, viewStyle]}/>
        }

        return (
            <View style={[{flexDirection: "row"}, viewStyle]}>
                {this.renderScoreOrTime(event)}
                <EventDetailsItem style={{flex: 1}}
                                  eventId={event.id}
                                  showFavorites={showFavorites}/>
            </View>
        )
    }

    private renderScoreOrTime(event: EventEntity) {
        const style: ViewStyle = {width: 68}
        const startTime = new Date(event.start)
        const now: Date = new Date()

        if (now > startTime) {
            return (
                <EventScoreItem eventId={event.id}
                                style={style}
                                sport={event.sport}
                />
            )
        }

        return <EventTimeItem event={event} style={style}/>
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

export const EventInfoItem: ComponentClass<ExternalProps> = connect<StateProps, {}, ExternalProps>(mapStateToProps)(EventInfoItemComponent)
