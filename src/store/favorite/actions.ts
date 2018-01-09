import {DispatchAction} from "store/DispatchAction";

export enum FavoriteActions {
    ADD = "ADD_FAVORITE",
    REMOVE = "REMOVE_FAVORITE"
}

export interface FavoriteAddAction extends DispatchAction<FavoriteActions.ADD> {
    eventId: number
}

export interface FavoriteRemoveAction extends DispatchAction<FavoriteActions.REMOVE> {
    eventId: number
}

export type FavoriteAction = FavoriteAddAction | FavoriteRemoveAction;

export function addFavorite(eventId: number): FavoriteAddAction {
    return {
        type: FavoriteActions.ADD,
        eventId
    }
}

export function removeFavorite(eventId: number): FavoriteRemoveAction {
    return {
        type: FavoriteActions.REMOVE,
        eventId
    }
}