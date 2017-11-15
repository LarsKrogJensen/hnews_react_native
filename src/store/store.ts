import {applyMiddleware, combineReducers, createStore, Reducer} from "redux"
import favoriteReducer, {FavoriteStore} from "./favorite/reducer"
import liveReducer, {LiveEventsStore} from "./live/reducer"
import entityReducer from "./entites/reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';

export interface AppStore {
    favoriteStore: FavoriteStore,
    liveStore: LiveEventsStore
}

const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
    favoriteStore: favoriteReducer,
    liveStore: liveReducer,
    entityStore: entityReducer
})

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(
    rootReducer,
    // applyMiddleware(thunk) // , reduxDevTools)
    composeWithDevTools(applyMiddleware(thunk))
)

export default store