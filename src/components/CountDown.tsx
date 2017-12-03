import * as React from "react"
import * as moment from "moment"
import {Text, TextStyle} from "react-native";

interface Props {
    start: string,
    format: string,
    style?: TextStyle
}

interface State {
    startTime: moment.Moment,
    now: number
}

export default class CountDown extends React.Component<Props, State> {

    private timer: number

    constructor(props: Props) {
        super(props);
        this.state = {
            startTime: moment.utc(props.start),
            now: moment.now()
        }
    }

    componentWillMount(): void {
       this.timer = setInterval(() => this.setState({now: moment.now()}), 1000);
    }

    componentWillUnmount(): void {
        clearInterval(this.timer)
    }

    public render() {
        let diff: number = this.state.startTime.diff(this.state.now);
        const timeToStart = moment.utc(diff).format(this.props.format)

        return <Text style={this.props.style}>{timeToStart}</Text>
    }
}