import * as React from "react"
import {Text} from "react-native"
import Screen from "screens/Screen";
import {NavigationParams, NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{params: NavigationParams}, {}>
}

export default class EventScreen extends React.Component<Props> {
    public render() {
        const {navigation, navigation: {state: {params = {}}}} = this.props
        return (
            <Screen title="Event" {...this.props}>
                <Text>Event screen {params.name}</Text>
            </Screen>
        )
    }
}