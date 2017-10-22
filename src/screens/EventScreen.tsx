import * as React from "react"
import {Text, View} from "react-native"

interface Props {
    navigation: any
}

export default class EventScreen extends React.Component<Props> {
    public render() {
        const {navigation} = this.props

        return (
            <View>
                <Text>Event screen</Text>
            </View>
        )
    }
}