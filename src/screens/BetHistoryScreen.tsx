import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
}

export class BetHistoryScreen extends React.Component<Props> {

    public render() {
        const {navigation} = this.props
        return (
            <View>
                <Text>Bethistory screen</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', {name: 'BETS'})}/>
            </View>
        )
    }
}