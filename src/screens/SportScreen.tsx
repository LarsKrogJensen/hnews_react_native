import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationParams, NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";


interface Props {
    navigation: NavigationScreenProp<{}, {}>
    sport: string,
    region: string,
    league: string
}

export default class SportScreen extends React.Component<Props> {

    public render() {
        const {navigation, sport, region, league} = this.props

        return (
            <Screen title="Sport" {...this.props} rootScreen>
                <Text>Sports {sport}</Text>
                <Text>Region {region}</Text>
                <Text>League {league}</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', {name: 'Floorball'})}/>
            </Screen>
        )
    }
}