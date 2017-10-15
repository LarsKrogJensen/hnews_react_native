import { INCREMENT, DECREMENT } from "./types"

export interface CounterState {
    count: number
}
const initialState: CounterState = {
    count: 0
}

export default function counterReducer(state: CounterState = initialState, action) {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                count: state.count + 1
            }
        case DECREMENT:
            return {
                ...state,
                count: state.count - 1
            }
        default:
            return state
    }
}