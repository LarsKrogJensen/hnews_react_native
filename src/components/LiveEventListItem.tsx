import * as React from "react"
import {BetOffer, LiveEvent} from "api/typings";
import {Text, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import LiveEventInfoItem from "components/LiveEventInfoItem";

// import {autobind} from "core-decorators";

interface Props {
    liveEvent: LiveEvent
}

export default class ListEventListItem extends React.Component<Props> {
    private itemStyle: ViewStyle = {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1
    }

    constructor() {
        super();
        this.renderOutcomes = this.renderOutcomes.bind(this)
    }

    public render() {
        const bo = this.props.liveEvent.mainBetOffer;

        return (
            <View style={this.itemStyle}>
                <LiveEventInfoItem liveEvent={this.props.liveEvent}/>
                {this.renderOutcomes(bo)}
            </View>
        );
    }

    // @autobind
    private renderOutcomes(bo: BetOffer) {
        if (!bo || !bo.outcomes) return undefined
        return (
            <View style={{flex: 1, flexDirection: 'row', marginTop: 8}}>
                {bo.outcomes.map(outcome => (
                    <OutcomeItem
                        key={outcome.id}
                        outcome={outcome}
                        event={this.props.liveEvent.event}/>
                ))}
            </View>
        )
    }
}