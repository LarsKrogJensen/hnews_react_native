import * as React from "react"
import {Button, Text, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
}

export default class SportScreen extends React.Component<Props> {

    public render() {
        const {navigation} = this.props

        return (
            <View>
                <Text>Sports screen</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', {name: 'Sport'})}/>
            </View>
        )
    }
}