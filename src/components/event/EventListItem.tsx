import * as React from "react"
import {ComponentClass} from "react"
import {EventInfoItem} from "components/event/EventInfoItem";
import Touchable from "components/Touchable";
import {Orientation, Theme} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import {View, ViewStyle} from "react-native";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {DefaultBetOfferItem} from "components/betoffer/DefaultBetOfferItem";
import {navigate} from "lib/navigate";


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
        const {event, orientation, navigation} = this.props
        const viewStyle = orientation === Orientation.Portrait ? portraitStyle : landscapeStyle;

        console.log("Rendering EventListItem")
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={viewStyle}>
                    <EventInfoItem eventId={event.id} viewStyle={{flex: 1, height: 68}} theme={Theme.Light}
                                   showFavorites/>
                    {event.mainBetOfferId &&
                    <DefaultBetOfferItem orientation={orientation} betofferId={event.mainBetOfferId} navigation={navigation}/>}
                </View>
            </Touchable>
        );
    }


    private handleItemClick = () => {
        navigate(this.props.navigation, "Event", {eventId: this.props.eventId})
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