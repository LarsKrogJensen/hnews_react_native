import {applyMiddleware, combineReducers, createStore, Reducer} from "redux"
import favoriteReducer, {FavoriteStore} from "./favorite/reducer"
import liveReducer, {LiveEventsStore} from "./live/reducer"
import entityReducer, {EntityStore} from "./entity/reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import {default as statsReducer, StatsStore} from "store/stats/reducer";
import {default as landingReducer, LandingStore} from "store/landing/reducer";
import {default as groupsReducer, GroupStore} from "store/groups/reducer";
import {SoonEventsStore, default as soonReducer} from "store/soon/reducer";
import {SportEventsStore, default as sportReducer} from "store/sport/reducer";

export interface AppStore {
    favoriteStore: FavoriteStore,
    liveStore: LiveEventsStore,
    entityStore: EntityStore,
    statsStore: StatsStore,
    landingStore: LandingStore,
    groupStore: GroupStore,
    soonStore: SoonEventsStore,
    sportStore: SportEventsStore
}

const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
    favoriteStore: favoriteReducer,
    liveStore: liveReducer,
    entityStore: entityReducer,
    statsStore: statsReducer,
    landingStore: landingReducer,
    groupStore: groupsReducer,
    soonStore: soonReducer,
    sportStore: sportReducer
})

// const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
const store = createStore(
    rootReducer,
    // applyMiddleware(thunk) // , reduxDevTools)
    composeWithDevTools(applyMiddleware(thunk))
)

export default store