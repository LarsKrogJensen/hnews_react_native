import * as React from "react"
import {BetOffer, LiveEvent} from "api/typings";
import OutcomeItem from "components/OutcomeItem";
import LiveEventInfoItem from "components/LiveEventInfoItem";
import {Orientation} from "lib/device";
import {NavigationScreenProp} from "react-navigation";
import Touchable from "components/Touchable";
import {View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import ActionDelegate from "store/ActionDelegate";

interface Props {
    navigation: NavigationScreenProp<{}, {}>,
    liveEvent: LiveEvent,
    orientation: Orientation
}

export default class ListEventListItem extends React.PureComponent<Props> {

    public render() {
        const bo = this.props.liveEvent.mainBetOffer;
        const orient = this.props.orientation

        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;

        // console.log("Render list item: " + this.props.liveEvent.event.id)
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={viewStyle}>
                    <LiveEventInfoItem liveEvent={this.props.liveEvent}
                                       viewStyle={{flex: 1, height: 68}}/>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                        {this.renderOutcomes(bo)}
                    </View>
                </View>
            </Touchable>
        );
    }

    componentDidMount(): void {
        // console.log("compoent did mount" + this.props.liveEvent.event.id)
    }

    @autobind
    private renderOutcomes(bo: BetOffer) {
        if (!bo || !bo.outcomes) return undefined
        return bo.outcomes.map(outcome => (
            <OutcomeItem
                key={outcome.id}
                orientation={this.props.orientation}
                outcome={outcome}
                event={this.props.liveEvent.event}/>
        ))
    }

    @autobind
    private handleItemClick() {
        this.props.navigation.navigate('Event', {event: this.props.liveEvent})
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