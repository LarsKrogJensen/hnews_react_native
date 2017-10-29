import React from "react"
import * as LiveActions from "store/live/actions"
import {ComponentClass, connect} from "react-redux"
import {AppStore} from "store/store"
import {Dispatch} from "redux"
import LiveEventsScreen from "screens/LiveEventsScreen";
import {NavigationScreenProp} from "react-navigation";
import ActionDelegate from "store/ActionDelegate";

interface PropsIn {
    navigation: NavigationScreenProp<{}, {}>
}

const mapStateToProps = (state: AppStore) => ({
    loading: state.liveStore.loading,
    events: state.liveStore.liveEvents,
    groups: state.liveStore.groups,
    favorites: state.favoriteStore.favorites
})

const mapDispatchToProps = (dispatch: Dispatch<any>, store: AppStore) => (
    {
        loadData: () => dispatch(LiveActions.load()),
        dispatch
    }
)

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    actions: new ActionDelegate(dispatchProps.dispatch, stateProps.favorites)
})

const LiveEventsWithData: ComponentClass<PropsIn> = connect<{}, {}, PropsIn>(mapStateToProps, mapDispatchToProps, mergeProps)(LiveEventsScreen)

export default LiveEventsWithData