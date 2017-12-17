import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationParams, NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{params: NavigationParams}, {}>
}

export default class SearchScreen extends React.Component<Props> {

    public render() {
        const {navigation} = this.props

        return (
            <View>
                <Text>Search screen</Text>
            </View>
        )
    }
}