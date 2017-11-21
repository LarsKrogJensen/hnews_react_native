import * as React from "react"
import {Text} from "react-native"
import Screen from "screens/Screen";

interface Props {
    navigation: any
}

export default class EventScreen extends React.Component<Props> {
    public render() {
        const {navigation} = this.props

        return (
            <Screen title="Event" {...this.props}>
                <Text>Event screen</Text>
            </Screen>
        )
    }
}