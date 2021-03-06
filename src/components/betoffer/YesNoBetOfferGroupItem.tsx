import * as React from "react"
import {OutcomeEntity} from "entity/OutcomeEntity";
import {EventEntity} from "entity/EventEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import {OutcomeTypes} from "components/betoffer/OutcomeTypes";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type YesNo = {
    paricipant: string,
    yes?: OutcomeEntity,
    no?: OutcomeEntity,
    betOfferId: number
}

export class YesNoBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        const rows: YesNo[] = outcomes.reduceRight((reduced, outcome) => {
            let yesNo = reduced.find(o => o.betOfferId === outcome.betOfferId)
            if (!yesNo) {
                yesNo = {
                    betOfferId: outcome.betOfferId,
                    paricipant: ""
                }
                reduced.push(yesNo)
            }

            if (outcome.type === OutcomeTypes.Yes) {
                yesNo.paricipant = outcome.participant || yesNo.paricipant
                yesNo.yes = outcome
            } else {
                yesNo.paricipant = outcome.participant || yesNo.paricipant
                yesNo.no = outcome
            }

            return reduced
        }, [] as YesNo[]).sort((h1, h2) => h1.paricipant.localeCompare(h2.paricipant))

        const yesOut = rows.find(r => r.yes !== undefined)
        const yesLabel = yesOut ? yesOut.yes!.label : "Yes"
        const noOut = rows.find(r => r.yes !== undefined)
        const noLabel = noOut ? noOut.no!.label : "No"

        return (
            <View style={styles.columnLayout}>
                <View style={[styles.rowLayout, {height: 35, alignItems: "center"}]}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.outcome, styles.label]}>{yesLabel}</Text>
                    <Text style={[styles.outcome, styles.label]}>{noLabel}</Text>
                </View>
                {rows.map(h2h => (
                    <View key={h2h.betOfferId} style={[styles.rowLayout, {marginVertical: 2, alignItems: "center"}]}>
                        <Text style={{flex: 1}}>{h2h.paricipant}</Text>
                        {
                            h2h.yes ? (
                                    <OutcomeItem
                                        style={styles.outcome}
                                        outcomeId={h2h.yes!.id}
                                        eventId={event.id}
                                        betOfferId={h2h.yes!.betOfferId}/>
                                )
                                : <View style={styles.outcome}/>
                        }
                        {
                            h2h.no
                                ? (
                                    <OutcomeItem
                                        style={styles.outcome}
                                        outcomeId={h2h.no.id}
                                        eventId={event.id}
                                        betOfferId={h2h.no.betOfferId}/>

                                )
                                : <View style={styles.outcome}/>
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
