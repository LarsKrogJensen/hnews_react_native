import {FavoriteAction, FavoriteActions} from "./actions"
import {Set} from "immutable"

export interface FavoriteStore {
    favorites: Set<number>
}
const initialState: FavoriteStore = {
    favorites: Set<number>()
}

export function favoriteReducer(state: FavoriteStore = initialState, action: FavoriteAction): FavoriteStore {
    switch (action.type) {
        case FavoriteActions.ADD:
            return {
                favorites: state.favorites.add(action.eventId)
            }
        case FavoriteActions.REMOVE:
            return {
                favorites: state.favorites.remove(action.eventId)
            }
        default:
            return state
    }
}