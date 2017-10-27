import * as React from "react"
import {Event, Outcome} from "api/typings";
import {Text, TextStyle, TouchableHighlight, View, ViewStyle} from "react-native";
import {isIos, Orientation} from "lib/platform";
import Touchable from "components/Touchable";
import autobind from "autobind-decorator";

interface Props {
    outcome: Outcome,
    event: Event,
    orientation: Orientation
}

export default class OutcomeItem extends React.Component<Props> {

    public render() {
        const {outcome, event, orientation} = this.props;
        const outcomeLabel = this.formatOutcomeLabel(outcome, event);

        const height = orientation === Orientation.Portrait ? 38 : 48
        const viewStyle = orientation === Orientation.Portrait ? portraitViewStyle : landscapeViewStyle
        const touchStyle: ViewStyle = {...touchBaseStyle, height}

        // console.log("oritentation - " + orientation)
        return (
            <Touchable key={outcome.id} style={touchStyle} onPress={() => console.log("Pressed")}>
                <View style={viewStyle}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={labelStyle}>{outcomeLabel}</Text>
                    <Text style={oddsStyle}>{outcome.odds / 1000}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
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

const touchBaseStyle: ViewStyle = {
    marginRight: 4,
    flex: 1,
    borderRadius: 3
}

const viewBaseStyle: ViewStyle = {
    height: 38,
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#00ADC9',
    borderRadius: 3
}

const portraitViewStyle: ViewStyle = {
    ...viewBaseStyle,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
}

const landscapeViewStyle: ViewStyle = {
    ...viewBaseStyle,
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
