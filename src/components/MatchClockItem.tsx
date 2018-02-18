import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {MatchClock} from "api/typings";
import {padTime} from "lib/dates";
import {connect} from "react-redux";
import {AppStore} from "store/store";

interface ExternalProps {
    eventId: number,
    style?: TextStyle,
    asHeader?: boolean
}

interface StateProps {
    matchClock?: MatchClock,
}

interface State {
    minute: number;
    second: number;
}

type Props = ExternalProps & StateProps

class MatchClockComponent extends React.Component<Props, State> {
    private timer?: number = undefined

    constructor(props: Props) {
        super(props);
        this.state = {
            minute: this.props.matchClock && this.props.matchClock.minute || 0,
            second: this.props.matchClock && this.props.matchClock.second || 0
        }
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>): boolean {
        if (nextProps.eventId !== this.props.eventId) return true
        if (nextProps.matchClock && !this.props.matchClock) return true
        if (!nextProps.matchClock && this.props.matchClock) return true
        if (nextProps.matchClock && this.props.matchClock) {
            const mcNext = nextProps.matchClock
            const mcThis = this.props.matchClock
            if (mcNext.running !== mcThis.running) return true
            if (mcNext.disabled !== mcThis.disabled) return true
            if (mcNext.minute !== this.state.minute) return true
            if (mcNext.second !== this.state.second) return true
        }

        return false
    }

    componentDidMount(): void {
        if (this.props.matchClock && this.props.matchClock.running) {
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

        if (nextProps.matchClock) {
            this.setState({
                    second: nextProps.matchClock.second,
                    minute: nextProps.matchClock.minute
                }
            )
        }
        if (nextProps.matchClock && nextProps.matchClock.running) {
            this.timer = setInterval(this.increment, 1000);
        }
    }

    public render() {
        const {minute, second} = this.state
        const {style, asHeader} = this.props

        if (asHeader) {
            return (
                <View style={[styles.header, style]}>
                    <Text style={styles.headerText}>{padTime(minute) + ":" + padTime(second)}</Text>
                </View>
            )
        }

        return <Text style={style}>{padTime(minute) + ":" + padTime(second)}</Text>
    }

    private increment = () => {
        this.setState((prevState: State): State => ({
                second: prevState.second === 59 ? 0 : prevState.second + 1,
                minute: prevState.second === 59 ? prevState.minute + 1 : prevState.minute
            })
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "black",
        paddingHorizontal: 4,
        borderRadius: 2,
        alignItems: "center",
        justifyContent: "center"
    } as ViewStyle,
    headerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    } as TextStyle
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    matchClock: state.statsStore.matchClocks.get(inputProps.eventId)
})

export const MatchClockItem: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(MatchClockComponent)