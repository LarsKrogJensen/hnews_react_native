import {applyMiddleware, combineReducers, createStore, Reducer} from "redux"
import counterReducer, {CounterState} from "./counter/reducer"
import liveReducer, {LiveEventsState} from "./live/reducer"
import thunk from "redux-thunk";
// import { composeWithDevTools } from 'remote-redux-devtools';
// import logger from "redux-logger"

export interface AppState {
    counter: CounterState,
    live: LiveEventsState
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    counter: counterReducer,
    live: liveReducer
})

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
    // composeWithDevTools(applyMiddleware(thunk))
    // applyMiddleware(thunk, logger)
)

export default store