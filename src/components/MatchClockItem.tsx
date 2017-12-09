import * as React from "react"
import {Text, TextStyle} from "react-native";
import {MatchClock} from "api/typings";
import autobind from "autobind-decorator";

interface Props {
    matchClock: MatchClock,
    style?: TextStyle
}

interface State {
    minute: number;
    second: number;
}

export default class MatchClockItem extends React.Component<Props, State> {

    private timer?: number = undefined

    constructor(props: Props) {
        super(props);
        this.state = {
            minute: this.props.matchClock.minute,
            second: this.props.matchClock.second
        }
    }

    componentWillMount(): void {
        if (this.props.matchClock.running) {
            this.timer = setInterval(this.increment, 1000);
        }
    }

    componentWillUnmount(): void {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = undefined
        }
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = undefined
        }

        this.setState({
                second: nextProps.matchClock.second,
                minute: nextProps.matchClock.minute
            }
        )
        if (nextProps.matchClock.running) {
            this.timer = setInterval(this.increment, 1000);
        }
    }

    public render() {
        let {minute, second} = this.state

        return <Text style={this.props.style}>{this.padTime(minute) + ":" + this.padTime(second)}</Text>
    }

    @autobind
    private increment() {
        this.setState((prevState: State): State => ({
                second: prevState.second === 59 ? 0 : prevState.second + 1,
                minute: prevState.second === 59 ? prevState.minute + 1 : prevState.minute
            })
        )
    }

    @autobind
    private padTime(t: number): string {
        if (t < 10) return "0" + t

        return t.toString()
    }
}