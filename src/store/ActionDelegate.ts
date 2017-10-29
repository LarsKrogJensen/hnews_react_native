import {Dispatch} from "redux";
import {Set} from "immutable"
import autobind from "autobind-decorator";
import {addFavorite, removeFavorite} from "store/favorite/actions";

export default class ActionDelegate {
    private dispatcher: Dispatch<any>
    private favorites: Set<number>

    constructor(dispatcher: Dispatch<any>, favorites: Set<number>) {
        this.dispatcher = dispatcher;
        this.favorites = favorites;
    }

    @autobind
    public isFavorite(eventId: number): boolean {
        return this.favorites.contains(eventId)
    }

    @autobind
    public toggleFavorite(eventId: number) {
        if (this.favorites.contains(eventId)) {
            this.dispatcher(removeFavorite(eventId))
        } else {
            this.dispatcher(addFavorite(eventId))
        }
    }
}