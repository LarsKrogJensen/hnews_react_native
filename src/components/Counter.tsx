import React, {Component} from "react"
import {StyleSheet, Text, View} from "react-native"
import Button from "./Button"

interface Props {
    count: number
    color: number,
    increment: () => any
    decrement: () => any
}

export default class Counter extends Component<Props, {}> {
    render() {
         console.log(`Color prop ${this.props.color}`)
        return (
            <View style={styles.container}>
                <Text>Lars</Text>
                <Text style={styles.counterText}>{this.props.count}</Text>
                <View style={styles.buttonContainer}>
                    <Button text="Decrement" onPress={this.props.decrement} backgroundColor="#F44336"/>
                    <Button text="Increment" onPress={this.props.increment} backgroundColor="#4CAF50"/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, alignItems: "center", justifyContent: "center"},
    counterText: {fontSize: 128, fontWeight: "bold"},
    buttonContainer: {flexDirection: "row"}
})