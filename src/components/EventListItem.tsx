import * as React from "react"
import {ComponentClass} from "react"
import {EventInfoItem} from "components/EventInfoItem";
import Touchable from "components/Touchable";
import {Orientation, Theme} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import {View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {DefaultBetOfferItem} from "components/betOffers/DefaultBetOfferItem";


interface ExternalProps {
    eventId: number
    orientation: Orientation
    navigation: NavigationScreenProp<{}, {}>,
    showFavorites?: boolean
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class EventListItem extends React.Component<Props> {

    public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.orientation !== this.props.orientation) return true
        if (nextProps.event.mainBetOfferId !== this.props.event.mainBetOfferId) return true

        return false
    }

    public render() {
        const orient = this.props.orientation
        const event = this.props.event
        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;

        // console.log("Rendering EventListItem")
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={viewStyle}>
                    <EventInfoItem eventId={event.id} viewStyle={{flex: 1, height: 68}} theme={Theme.Light} showFavorites/>
                    {event.mainBetOfferId &&
                    <DefaultBetOfferItem orientation={orient} betofferId={event.mainBetOfferId}/>}
                </View>
            </Touchable>
        );
    }

    @autobind
    private handleItemClick() {
        this.props.navigation.navigate('Event', {eventId: this.props.eventId})
    }
}

const itemStyle: ViewStyle = {
    padding: 8,
    backgroundColor: "#F6F6F6",
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1
}
const portraitStyle: ViewStyle = {
    ...itemStyle,
    flexDirection: "column"
}

const landscapeStyle: ViewStyle = {
    ...itemStyle,
    flexDirection: "row"
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(EventListItem)

export default WithData