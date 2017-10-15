import React, {Component} from "react"
import Counter from "../components/Counter"
import * as CounterActions from "../redux/counter/actions"
import {ComponentClass, connect} from "react-redux"
import {AppState} from "../redux"

interface PropsIn {
    color: number
}

interface Props {
    count: number
    increment: () => any
    decrement: () => any
}

class CounterContainer extends Component<Props & PropsIn, {}> {
    intervalId: number

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            this.props.increment()
        }, 1000)
    }

    render() {
        return (
            <Counter {...this.props} />
        )
    }
}

const CounterWithData: ComponentClass<PropsIn> = connect<{}, {}, PropsIn>(
    (state: AppState) => ({
        count: state.counter.count
    }),
    (dispatch) => ({
        increment: () => dispatch(CounterActions.increment()),
        decrement: () => dispatch(CounterActions.decrement())
    }))(CounterContainer)

export default CounterWithData