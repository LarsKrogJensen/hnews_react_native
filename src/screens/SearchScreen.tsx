import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
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