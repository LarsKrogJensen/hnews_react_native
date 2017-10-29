import * as types from "./types"

export interface AddFavoriteAction {
    type: types.ADD_FAVORITE_TYPE
    eventId: number
}

export interface RemoveFavoriteAction {
    type: types.REMOVE_FAVORITE_TYPE
    eventId: number
}

export type FavoriteAction = AddFavoriteAction | RemoveFavoriteAction;

export function addFavorite(eventId: number): AddFavoriteAction {
    return {
        type: types.ADD_FAVORITE,
        eventId
    }
}

export function removeFavorite(eventId: number): RemoveFavoriteAction {
    return {
        type: types.REMOVE_FAVORITE,
        eventId
    }
}