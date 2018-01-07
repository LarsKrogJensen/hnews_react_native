export enum FavoriteActions {
    ADD = "ADD_FAVORITE",
    REMOVE = "REMOVE_FAVORITE"
}

export interface AddFavoriteAction {
    type: FavoriteActions.ADD
    eventId: number
}

export interface RemoveFavoriteAction {
    type: FavoriteActions.REMOVE
    eventId: number
}

export type FavoriteAction = AddFavoriteAction | RemoveFavoriteAction;

export function addFavorite(eventId: number): AddFavoriteAction {
    return {
        type: FavoriteActions.ADD,
        eventId
    }
}

export function removeFavorite(eventId: number): RemoveFavoriteAction {
    return {
        type: FavoriteActions.REMOVE,
        eventId
    }
}