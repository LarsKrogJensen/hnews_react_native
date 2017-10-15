import {combineReducers, Reducer} from "redux"

import counter, {CounterState} from "./counter/reducer"

export interface AppState {
    counter: CounterState
}
// Add more
const appReducer: Reducer<AppState> = combineReducers<AppState>({
    counter
})

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === "RESET") ? undefined : state
    return appReducer(newState, action)
}

export default rootReducer