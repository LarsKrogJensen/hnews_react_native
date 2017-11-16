import {applyMiddleware, combineReducers, createStore, Reducer} from "redux"
import favoriteReducer, {FavoriteStore} from "./favorite/reducer"
import liveReducer, {LiveEventsStore} from "./live/reducer"
import entityReducer, {EntityStore} from "./entity/reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import {default as statsReducer, StatsStore} from "store/stats/reducer";

export interface AppStore {
    favoriteStore: FavoriteStore,
    liveStore: LiveEventsStore,
    entityStore: EntityStore,
    statsStore: StatsStore
}

const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
    favoriteStore: favoriteReducer,
    liveStore: liveReducer,
    entityStore: entityReducer,
    statsStore: statsReducer
})

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(
    rootReducer,
    // applyMiddleware(thunk) // , reduxDevTools)
    composeWithDevTools(applyMiddleware(thunk))
)

export default store