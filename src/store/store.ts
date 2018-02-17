import {applyMiddleware, combineReducers, createStore, Reducer, Store} from "redux"
import {favoriteReducer, FavoriteStore} from "./favorite/reducer"
import {liveReducer, LiveEventsStore} from "./live/reducer"
import {entityReducer,EntityStore} from "./entity/reducer";
import thunk from "redux-thunk";
import {composeWithDevTools} from 'redux-devtools-extension';
import {statsReducer, StatsStore} from "store/stats/reducer";
import {landingReducer, LandingStore} from "store/landing/reducer";
import {groupsReducer, GroupStore} from "store/groups/reducer";
import {soonReducer, SoonEventsStore} from "store/soon/reducer";
import {sportReducer, SportEventsStore} from "store/sport/reducer";
import {pushInitialize} from "store/push/push-hub";
import {API} from "store/API";
import {searchReducer, SearchStore} from "store/search/reducer";

export interface AppStore {
    favoriteStore: FavoriteStore,
    liveStore: LiveEventsStore,
    entityStore: EntityStore,
    statsStore: StatsStore,
    landingStore: LandingStore,
    groupStore: GroupStore,
    soonStore: SoonEventsStore,
    sportStore: SportEventsStore,
    searchStore: SearchStore
}

const rootReducer: Reducer<AppStore> = combineReducers<AppStore>({
    favoriteStore: favoriteReducer,
    liveStore: liveReducer,
    entityStore: entityReducer,
    statsStore: statsReducer,
    landingStore: landingReducer,
    groupStore: groupsReducer,
    soonStore: soonReducer,
    sportStore: sportReducer,
    searchStore: searchReducer
})

export const store: Store<AppStore> = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
)

pushInitialize(store, "ev", `${API.pushLang}.ev`)
