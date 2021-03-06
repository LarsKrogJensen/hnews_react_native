import * as React from "react"
import {OutcomeEntity} from "entity/OutcomeEntity";
import {EventEntity} from "entity/EventEntity";
import {StyleSheet, Text, ViewStyle} from "react-native";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

export class TemplateBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        return (
           <Text>Teemplate</Text>
        )

    }
}

const styles = StyleSheet.create({
    rowLayout: {
        flex: 1,
        flexDirection: 'row'
    } as ViewStyle,
    columnLayout: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "stretch",
        justifyContent: "flex-start"
    } as ViewStyle,
    outcome: {
        width: "20%",
        flex: 0
    } as ViewStyle,
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    }
})
