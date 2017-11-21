import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {Image, StyleSheet, Text, View} from "react-native";
import banner from "images/banner";
import absoluteFill = StyleSheet.absoluteFill;

interface DrawerProps {
    navigation: NavigationScreenProp<{}, {}>
}

export default class Drawer extends React.Component<DrawerProps> {

    render() {
        return (
            <View style={{backgroundColor: "#333333", flexDirection: "column"}}>
                <View style={{height: 100, justifyContent: "center", alignItems: "center"}}>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Text style={{color: "white", fontSize: 24, fontWeight: "bold"}}>PLAY</Text>
                </View>
                <View style={{flex: 1, backgroundColor: "#333333"}}>
                    <Text> Yes</Text>
                </View>
            </View>
        )
    }
}
