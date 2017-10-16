import React, {Component} from "react"
import * as actions from "store/counter/actions"
import {ComponentClass, connect} from "react-redux"
import {AppState} from "store"
import {Dispatch} from "redux"
import Counter from "components/Counter"

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
            // this.props.increment()
        }, 1000)
    }

    render() {
        return (
            <Counter {...this.props} />
        )
    }
}

const mapStateToProps = (state: AppState) => (
    {
        count: state.counter.count
    }
)

const mapDispatchToProps = (dispatch: Dispatch<actions.CounterAction>) => (
    {
        increment: () => dispatch(actions.increment(1)),
        decrement: () => dispatch(actions.decrement(2))
    }
)
const CounterWithData: ComponentClass<PropsIn> = connect<{}, {}, PropsIn>(mapStateToProps, mapDispatchToProps)(CounterContainer)

export default CounterWithData