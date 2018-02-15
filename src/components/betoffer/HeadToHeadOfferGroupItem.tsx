import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type HeadToHead = {
    betOfferId: number
    outcomes: OutcomeEntity[],
}

export class HeadToHeadBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        const rows: HeadToHead[] = outcomes.reduceRight((reduced, outcome) => {
            let h2h = reduced.find(o => o.betOfferId === outcome.betOfferId)
            if (!h2h) {
                h2h = {
                    betOfferId: outcome.betOfferId,
                    outcomes: []
                }
                reduced.push(h2h)
            }

            h2h.outcomes.push(outcome)

            return reduced
        }, [] as HeadToHead[])


        return (
            <View style={styles.columnLayout}>
                {rows.map(h2h => (
                    <View key={h2h.betOfferId} style={[styles.columnLayout, {marginBottom: 16, alignItems: "stretch"}]}>
                        {
                            h2h.outcomes.sort((o1, o2) => o1.odds - o2.odds).map(outcome => (
                                <OutcomeItem
                                    key={outcome.id}
                                    style={styles.outcome}
                                    outcomeId={outcome.id}
                                    eventId={event.id}
                                    overrideShowLabel={true}
                                    betOfferId={h2h.betOfferId}/>
                            ))
                        }
                    </View>
                ))}
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
        marginVertical: 2,
        flex: 1
    } as ViewStyle,
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    }
})
