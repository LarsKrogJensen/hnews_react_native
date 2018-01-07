import * as React from "react"
import {ComponentClass} from "react"
import {Text, ViewStyle} from "react-native"
import Screen from "screens/Screen";
import {NavigationParams, NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";


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

        return false
    }

    public render() {
        const {event} = this.props
        return (
            <Screen title="Event" {...this.props}>
                <Text>Event screen {event.name} state {event.state}</Text>
            </Screen>
        )
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

//
// const WithAppStateRefresh: ComponentClass<Props> =
//     connectAppState((props: Props, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(SportScreenComponent))

export const EventScreen: ComponentClass<ExternalProps> =
    connect<StateProps, ExternalProps>(mapStateToProps)(EventScreenComponent)
