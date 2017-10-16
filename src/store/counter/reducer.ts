import { INCREMENT, DECREMENT } from "./types"
import {CounterAction} from "./actions"

export interface CounterState {
    count: number
}
const initialState: CounterState = {
    count: 0
}

export default function counterReducer(state: CounterState = initialState, action: CounterAction): CounterState {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                count: state.count + action.value
            }
        case DECREMENT:
            return {
                ...state,
                count: state.count - action.amount
            }
        default:
            return state
    }
}