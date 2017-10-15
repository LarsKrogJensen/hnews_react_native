import React, {Component} from "react"
import {StyleSheet, Text, TouchableHighlight} from "react-native"

interface Props {
    text: string
    onPress: () => void
    backgroundColor: string
}

export default class Button extends Component<Props, {}> {
    render() {
        const {backgroundColor, onPress, text} = this.props
        return (
            <TouchableHighlight onPress={onPress}
                                underlayColor={backgroundColor}
                                style={[styles.button, {backgroundColor}]}>
                <Text style={styles.text}>{text}</Text>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    button: {padding: 5, margin: 2, width: 150, height: 80, justifyContent: "center", alignItems: "center"},
    text: {fontSize: 28}
})