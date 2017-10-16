import * as types from "./types"

export interface IncrementAction {
    type: types.INCREMENT_TYPE
    value: number
}

export interface DecrementAction {
    type: types.DECREMENT_TYPE
    amount: number
}

export type CounterAction = IncrementAction | DecrementAction;

export function increment(amount: number): IncrementAction {
    return {
        type: types.INCREMENT,
        value: amount
    }
}

export function decrement(amount: number): DecrementAction {
    return {
        type: types.DECREMENT,
        amount
    }
}