import React from "react"
import * as actions from "store/live/actions"
import {ComponentClass, connect} from "react-redux"
import {AppState} from "store/store"
import {Dispatch} from "redux"
import LiveEventsScreen from "screens/LiveEventsScreen";
import {NavigationScreenProp} from "react-navigation";

interface PropsIn {
    navigation: NavigationScreenProp<{}, {}>
}

const mapStateToProps = (state: AppState) => ({
    loading: state.live.loading,
    events: state.live.liveEvents,
    groups: state.live.groups
})

const mapDispatchToProps = (dispatch: Dispatch<actions.LiveLoadAction>) => (
    {
        load: () => dispatch(actions.load())
    }
)
const LiveEventsWithData: ComponentClass<PropsIn> = connect<{}, {}, PropsIn>(mapStateToProps, mapDispatchToProps)(LiveEventsScreen)

export default LiveEventsWithData