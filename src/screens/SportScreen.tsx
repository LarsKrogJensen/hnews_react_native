import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationParams, NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";


interface NavParams {
    params: NavigationParams
}

interface Props {
    navigation: NavigationScreenProp<NavParams, {}>
}

export default class SportScreen extends React.Component<Props> {

    public render() {
        const {navigation, navigation: {state: {params = {}}}} = this.props

        return (
            <Screen title="Sport" {...this.props} rootScreen>
                <Text>Sports screen {params.sport} - {params.league}</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', {name: 'Floorball'})}/>
            </Screen>
        )
    }
}