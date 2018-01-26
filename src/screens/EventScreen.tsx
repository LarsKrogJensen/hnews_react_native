import * as React from "react"
import {ComponentClass} from "react"
import {Image, StatusBar, StyleSheet, View, ViewStyle} from "react-native"
import {NavigationParams, NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {EventView} from "views/EventView";
import {EventInfoItem} from "components/EventInfoItem";
import {Theme} from "lib/device";
import banner from "images/banner";
import absoluteFill = StyleSheet.absoluteFill;
import Screen from "screens/Screen";
import {LiveCardScore} from "components/LiveCardScore";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: NavigationParams }, {}>
    eventId: number
    style?: ViewStyle
}

interface StateProps {
    event: EventEntity
}

type Props = StateProps & ExternalProps

class EventScreenComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (this.props.eventId !== nextProps.eventId) return true
        if (this.props.event.state && nextProps.event.state) return true
        if (this.props.event.openForLiveBetting && nextProps.event.openForLiveBetting) return true

        return false
    }

    public render() {

        return (
            <Screen navigation={this.props.navigation} title={this.renderTitle()}>
                {this.renderBody()}
            </Screen>
        )
    }

    private renderTitle() {
        const {event, navigation} = this.props
        if (event.state === "STARTED") {
            return <LiveCardScore eventId={event.id} navigation={navigation}/>
        }

        return <EventInfoItem eventId={event.id} theme={Theme.Dark} viewStyle={{flex: 1}}/>
    }

    private renderBody() {
        const {event, navigation} = this.props

        return <EventView eventId={event.id}
                          live={event.state === "STARTED"}
                          eventGroupid={event.groupId}
                          navigation={navigation}/>
    }
}

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {

    const params = inputProps.navigation.state.params
    const eventId = params.eventId

    return {
        event: state.entityStore.events.get(eventId)
    }
}

export const EventScreen: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(EventScreenComponent)
