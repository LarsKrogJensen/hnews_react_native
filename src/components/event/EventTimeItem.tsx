import * as React from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {EventEntity} from "model/EventEntity";
import * as moment from "moment";
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import CountDown from "components/CountDown";
import {Theme} from "lib/device";

interface Props {
    style: ViewStyle,
    event: EventEntity,
    theme?: Theme
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
        }

        return this.renderDateTime()

    }

    private renderDateTime = () => {

        const start = moment.utc(this.props.event.start)
        const now = moment.utc(moment.now())


        const isToday = start.diff(now, 'days') === 0
        let date = ""
        if (!isToday) {
            if (start.week() === now.weeks()) {
                date = start.format("ddd")
            } else {
                date = start.format("DD MMM")
            }
        }

        return (
            <React.Fragment>
                {!isToday && <Text key="date" style={styles.date}>{date}</Text>}
                <Text key="time" style={styles.time}>{start.format("HH:mm")}</Text>
            </React.Fragment>
        )
    }

}

const styles = StyleSheet.create({
    time: {
        fontSize: 16,
        fontWeight: "400",
        color: "#717171"
    } as TextStyle,
    date: {
        fontSize: 16,
        fontWeight: "700",
        color: "#717171"
    } as TextStyle
})
