import * as React from "react"
import {OutcomeEntity} from "entity/OutcomeEntity";
import {EventEntity} from "entity/EventEntity";
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import {OutcomeTypes} from "components/betoffer/OutcomeTypes";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

export class OverUnderBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        // render 2 columns first with over and second under
        const over = outcomes.filter(o => o.type === OutcomeTypes.Over && o.line).sort((o1, o2) => o1.line!! - o2.line!!)
        const under = outcomes.filter(o => o.type === OutcomeTypes.Under && o.line).sort((o1, o2) => o1.line!! - o2.line!!)

        return (
            <View style={styles.rowLayout}>
                <View style={styles.columnLayout}>
                    {over.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={styles.outcome}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {under.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={{marginVertical: 2}}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
            </View>
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
        marginVertical: 2
    } as ViewStyle,
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    }
})
