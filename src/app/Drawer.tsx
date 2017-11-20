import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {Button, View} from "react-native";

interface DraweProps {
    navigation: NavigationScreenProp<{}, {}>
}

export default class Drawer extends React.Component<DraweProps> {

    render() {
        return (
            <View style={{marginTop: 64}}>
                <Button
                    onPress={() => this.props.navigation.navigate('Home')}
                    title="Go to Home"
                />
                <Button
                    onPress={() => this.props.navigation.navigate('Live')}
                    title="Go to Live"
                />
            </View>
        )
    }
}
