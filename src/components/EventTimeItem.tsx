import * as React from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {EventEntity} from "model/EventEntity";

interface Props {
    style: ViewStyle,
    event: EventEntity,
}

export default class EventTimeItem extends React.PureComponent<Props> {

    public render() {
        const date = new Date(this.props.event.start);

        return this.renderDateTime(date)
    }

    @autobind
    private renderDateTime(date: Date) {
        const style: ViewStyle = {
            ...this.props.style,
            justifyContent: "center",
            alignItems: "center"
        }

        const isToday = date.toDateString === new Date().toDateString
        return (
            <View style={style}>
                {!isToday && this.renderDate(date)}
                <Text style={timeStyle}>{this.padTime(date.getHours())}:{this.padTime(date.getMinutes())}</Text>
            </View>
        )
    }

    private renderDate(date: Date) {
        return (
            <Text style={dateStyle}>{date.getDay()}/{date.getMonth()}</Text>
        )
    }

    @autobind
    private padTime(hours: number): string {
        if (hours < 10) return "0" + hours

        return hours.toString()
    }
}

const timeStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "400",
    color: "#717171"
}

const dateStyle: TextStyle = {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333"
}
