import * as React from "react"
import {Event, Outcome} from "api/typings";
import {Text, TextStyle, View, ViewStyle} from "react-native";

interface Props {
    outcome: Outcome,
    event: Event
}

export default class OutcomeItem extends React.Component<Props> {
    private style: ViewStyle = {
        height: 38,
        flex: 1,
        flexDirection: 'row',
        marginRight: 4,
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#00ADC9',
        borderRadius: 3
    }

    private labelStyle: TextStyle = {
        color: "#DEF5FA",
        flex: 1,
        fontSize: 12
    }

    private oddsStyle: TextStyle = {
        color: "white",
        marginLeft: 8,
        fontSize: 12,
        fontWeight: "bold"
    }

    public render() {
        const {outcome, event} = this.props;
        let outcomeLabel = this.formatOutcomeLabel(outcome, event);
        return (
            <View key={outcome.id}
                  style={this.style}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={this.labelStyle}>{outcomeLabel}</Text>
                <Text style={this.oddsStyle}>{outcome.odds / 1000}</Text>
            </View>
        )
    }

    // @autobind
    private formatOutcomeLabel(outcome: Outcome, event: Event): string {
        if (outcome.type === "OT_CROSS")
            return "Draw"
        if (outcome.type === "OT_ONE")
            return event.homeName;
        if (outcome.type === "OT_TWO")
            return event.awayName;

        return outcome.type
    }
}