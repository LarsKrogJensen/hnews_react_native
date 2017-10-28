import * as React from "react"
import {Button, StatusBar, Text, View} from "react-native"
import {NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
}

export default class HomeScreen extends React.Component<Props> {

    public render() {
        const {navigation} = this.props
        return (
            <View>
                <Text>Home screeEEEEn</Text>
                <Button title="Goto Event" onPress={() => navigation.navigate('Event', { name: 'Home' })}/>
            </View>
        )
    }
}