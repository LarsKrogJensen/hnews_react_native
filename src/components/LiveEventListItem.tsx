import * as React from "react"
import {BetOffer, LiveEvent} from "api/typings";
import OutcomeItem from "components/OutcomeItem";
import LiveEventInfoItem from "components/LiveEventInfoItem";
import {Orientation} from "lib/platform";
import {NavigationScreenProp} from "react-navigation";
import Touchable from "components/Touchable";
import {View, ViewStyle} from "react-native";

interface Props {
    navigation: NavigationScreenProp<{}, {}>,
    liveEvent: LiveEvent,
    orientation: Orientation
}

export default class ListEventListItem extends React.PureComponent<Props> {

    constructor() {
        super();
        this.renderOutcomes = this.renderOutcomes.bind(this)
        this.handleItemClick = this.handleItemClick.bind(this)
    }

    public render() {
        const bo = this.props.liveEvent.mainBetOffer;
        const orient = this.props.orientation

        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;
        
        return (
            <Touchable onPress={this.handleItemClick}>
                <View style={viewStyle}>
                    <LiveEventInfoItem liveEvent={this.props.liveEvent} viewStyle={{flex: 1, height: 68}}/>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                        {this.renderOutcomes(bo)}
                    </View>
                </View>
            </Touchable>
        );
    }

    // @autobind
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