import * as React from "react"
import {BetOffer, LiveEvent} from "api/typings";
import {Text, View} from "react-native";
import OutcomeItem from "components/OutcomeItem";

// import {autobind} from "core-decorators";

interface Props {
    liveEvent: LiveEvent
}

export default class ListEventListItem extends React.Component<Props> {

    constructor() {
        super();
        this.renderOutcomes = this.renderOutcomes.bind(this)
    }

    public render() {
        const event = this.props.liveEvent.event;
        const bo = this.props.liveEvent.mainBetOffer;

        return (
            <View style={{margin: 8}}>
                <Text>{event.homeName}</Text>
                <Text>{event.awayName}</Text>
                {bo && this.renderOutcomes(bo)}
            </View>
        );
    }

    // @autobind
    private renderOutcomes(bo: BetOffer) {
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                {bo.outcomes && bo.outcomes.map(outcome => (
                    <OutcomeItem
                        key={outcome.id}
                        outcome={outcome}
                        event={this.props.liveEvent.event}/>
                ))}
            </View>
        )
    }
}