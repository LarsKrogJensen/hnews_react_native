import * as React from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import {EventEntity} from "model/EventEntity";
import * as moment from "moment";
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import autobind from "autobind-decorator";
import CountDown from "components/CountDown";

interface Props {
    style: ViewStyle,
    event: EventEntity,
}

export default class EventTimeItem extends React.PureComponent<Props> {

    public render() {

        const style: ViewStyle = {
            ...this.props.style,
            justifyContent: "center",
            alignItems: "center"
        }

        return (
            <View style={style}>
                {this.renderBody()}
            </View>
        )
    }

    private renderBody() {
        const start = moment.utc(this.props.event.start)
        const now = moment.utc(moment.now())
        const secondsToGo = start.diff(now, "s");
        const total = 15 * 60;
        
        if (secondsToGo < total && secondsToGo > 0) {
            const fill = 100 - (secondsToGo / total) * 100
            console.log("Fill: " + fill)
            return (
                <View style={{alignItems: "center"}}>
                    <AnimatedCircularProgress
                        size={20}
                        width={10}
                        fill={fill}
                        preFill={fill}
                        rotation={0}
                        tintColor="#00ADC9"
                        backgroundColor="#ddd"/>
                    <CountDown style={{marginTop: 4}}
                               start={this.props.event.start}
                               format="mm:ss"/>
                </View>
            )

            // return
        }

        return this.renderDateTime()

    }

    @autobind
    private renderDateTime() {

        const date = new Date(this.props.event.start);
        const isToday = date.toDateString === new Date().toDateString
        return (
            [
                !isToday && this.renderDate(date),
                <Text key="time"
                      style={timeStyle}>{this.padTime(date.getHours())}:{this.padTime(date.getMinutes())}</Text>
            ]
        )
    }

    private renderDate(date: Date) {
        return (
            <Text key="date" style={dateStyle}>{date.getDay()}/{date.getMonth()}</Text>
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
