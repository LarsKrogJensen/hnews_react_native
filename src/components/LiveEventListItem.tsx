import * as React from "react"
import {ComponentClass} from "react"
import BetOfferItem from "components/BetOfferItem";
import LiveEventInfoItem from "components/LiveEventInfoItem";
import Touchable from "components/Touchable";
import {Orientation} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import {View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";

interface Props {
    navigation: NavigationScreenProp<{}, {}>,
    event: EventEntity,
    orientation: Orientation
}

class ListEventListItem extends React.PureComponent<Props> {

    public render() {
        const orient = this.props.orientation
        const event = this.props.event
        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;

        // console.log("Render list item: " + this.props.liveEvent.event.id)
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={viewStyle}>
                    <LiveEventInfoItem eventId={event.id}
                                       viewStyle={{flex: 1, height: 68}}/>
                    <BetOfferItem orientation={orient} betofferId={event.mainBetOfferId}/>
                </View>
            </Touchable>
        );
    }

    componentDidMount(): void {
        // console.log("compoent did mount" + this.props.liveEvent.event.id)
    }



    @autobind
    private handleItemClick() {
        this.props.navigation.navigate('Event', {event: this.props.event})
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

interface PropsIn {
    eventId: number
    orientation: Orientation
    navigation: NavigationScreenProp<{}, {}>,
}

const mapStateToProps = (state: AppStore, inputProps: PropsIn) => ({
    event: state.entityStore.events.get(inputProps.eventId),
    orientation: inputProps.orientation,
    navigation: inputProps.navigation
})


const WithData: ComponentClass<PropsIn> =
    connect<Props, {}, PropsIn>(mapStateToProps)(ListEventListItem)

export default WithData