import * as React from "react"
import {Event, Outcome} from "api/typings";
import {Text, TextStyle, TouchableHighlight, TouchableNativeFeedback, View, ViewStyle} from "react-native";
import {orientation, Orientation} from "lib/platform";

interface Props {
    outcome: Outcome,
    event: Event
}

export default class OutcomeItem extends React.Component<Props> {

    public render() {
        const {outcome, event} = this.props;
        const outcomeLabel = this.formatOutcomeLabel(outcome, event);
        const orien = orientation();
        const height = orien === Orientation.Portrait ? 38 : 48
        const viewStyle = orien === Orientation.Portrait ? portraitViewStyle : landscapeViewStyle
        return (
            <TouchableNativeFeedback key={outcome.id} onPress={() => console.log("Pressed")}>
                <View style={viewStyle}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={labelStyle}>{outcomeLabel}</Text>
                    <Text style={oddsStyle}>{outcome.odds / 1000}</Text>
                </View>
            </TouchableNativeFeedback>
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

const touchStyle: ViewStyle = {
    height: 38,
    flex: 1,
    flexDirection: 'row',
    marginRight: 4,
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#00ADC9',
    borderRadius: 3
}

const portraitViewStyle: ViewStyle = {
    ...touchStyle,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
}

const landscapeViewStyle: ViewStyle = {
    ...touchStyle,
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: 'center'
}

const labelStyle: TextStyle = {
    color: "#DEF5FA",
    flex: 1,
    fontSize: 12
}

const oddsStyle: TextStyle = {
    color: "white",
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "bold"
}
