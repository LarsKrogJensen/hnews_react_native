import { ADD_FAVORITE, REMOVE_FAVORITE } from "./types"
import {FavoriteAction} from "./actions"
import {Set} from "immutable"

export interface FavoriteStore {
    favorites: Set<number>
}
const initialState: FavoriteStore = {
    favorites: Set()
}

export default function favoriteReducer(state: FavoriteStore = initialState, action: FavoriteAction): FavoriteStore {
    switch (action.type) {
        case ADD_FAVORITE:
            return {
                favorites: state.favorites.add(action.eventId)
            }
        case REMOVE_FAVORITE:
            return {
                favorites: state.favorites.remove(action.eventId)
            }
        default:
            return state
    }
}