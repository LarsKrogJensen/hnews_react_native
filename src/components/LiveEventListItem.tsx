import * as React from "react"
import {BetOffer, LiveEvent} from "api/typings";
import {View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import LiveEventInfoItem from "components/LiveEventInfoItem";
import {orientation, Orientation} from "lib/platform";

interface Props {
    liveEvent: LiveEvent
}

export default class ListEventListItem extends React.Component<Props> {

    constructor() {
        super();
        this.renderOutcomes = this.renderOutcomes.bind(this)
    }

    public render() {
        const bo = this.props.liveEvent.mainBetOffer;

        const orient = orientation();
        const viewStyle = orient === Orientation.Portrait ? portraitStyle : landscapeStyle;
        return (
            <View style={viewStyle}>
                <LiveEventInfoItem liveEvent={this.props.liveEvent} viewStyle={{flex: 1, height: 68}}/>
                <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                    {this.renderOutcomes(bo)}
                </View>
            </View>
        );
    }

    // @autobind
    private renderOutcomes(bo: BetOffer) {
        if (!bo || !bo.outcomes) return undefined
        return bo.outcomes.map(outcome => (
            <OutcomeItem
                key={outcome.id}
                outcome={outcome}
                event={this.props.liveEvent.event}/>
        ))
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