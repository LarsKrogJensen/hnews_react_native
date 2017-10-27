import {applyMiddleware, combineReducers, createStore, Reducer} from "redux"
import counterReducer, {CounterState} from "./counter/reducer"
import liveReducer, {LiveEventsState} from "./live/reducer"
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

export interface AppState {
    counter: CounterState,
    live: LiveEventsState
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
    counter: counterReducer,
    live: liveReducer
})

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(
    rootReducer,
    // applyMiddleware(thunk) // , reduxDevTools)
    composeWithDevTools(applyMiddleware(thunk))
)

export default store