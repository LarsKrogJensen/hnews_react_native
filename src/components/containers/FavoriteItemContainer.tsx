import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {ComponentClass} from "react";
import {connect} from "react-redux";
import FavItem from "components/FavoriteItem";
import * as Actions from "store/favorite/actions"

interface PropsIn {
    eventId: number
}

const mapStateToProps = (state: AppStore) => ({
    favorites: state.favoriteStore.favorites
})

const mapDispatchToProps = (dispatch: Dispatch<any>, store: AppStore) => (
    {
        dispatch
    }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    isFavorite: stateProps.favorites.contains(ownProps.eventId),
    toggle: () => {
        if (!stateProps.favorites.contains(ownProps.eventId))
            dispatchProps.dispatch(Actions.addFavorite(ownProps.eventId))
        else
            dispatchProps.dispatch(Actions.removeFavorite(ownProps.eventId))
    }
})

const FavoriteItem: ComponentClass<PropsIn> = connect<{}, {}, PropsIn>(mapStateToProps, mapDispatchToProps, mergeProps)(FavItem)

export default FavoriteItem