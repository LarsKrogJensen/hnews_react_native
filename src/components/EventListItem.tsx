import * as React from "react"
import {ComponentClass} from "react"
import BetOfferItem from "components/BetOfferItem";
import LiveEventInfoItem from "components/EventInfoItem";
import Touchable from "components/Touchable";
import {Orientation} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import {View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";


interface ExternalProps {
    eventId: number
    orientation: Orientation
    navigation: NavigationScreenProp<{}, {}>,
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class ListEventListItem extends React.PureComponent<Props> {

    public render() {
        const orient = this.props.orientation
        const event = this.props.event
        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;

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

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId)
})

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(ListEventListItem)

export default WithData