import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type OutcomeWithHtFt = OutcomeEntity & { halfTime: number, fullTime: number }

export class HalfTimeFullTimeBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        // render 3 columns first with home win, second draw and third away win

        const outcomesWithHtFt: OutcomeWithHtFt[] = outcomes.map(outcome => ({...outcome, ...this.parseHtFt(outcome.label)}))

        const home = outcomesWithHtFt.filter(o => o.fullTime === 1).sort((o1, o2) => o1.halfTime - o2.halfTime)
        const draw = outcomesWithHtFt.filter(o => o.fullTime === 1.5).sort((o1, o2) => o1.halfTime - o2.halfTime)
        const away = outcomesWithHtFt.filter(o => o.fullTime === 2).sort((o1, o2) => o1.halfTime - o2.halfTime)

        return (
            <View style={styles.rowLayout}>
                <View style={styles.columnLayout}>
                    {home.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={styles.outcome}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {draw.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={styles.outcome}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {away.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={styles.outcome}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
            </View>
        )
    }

    private parseHtFt(scoreLabel: string): { halfTime: number, fullTime: number } {
        let scoreParts: string[] = scoreLabel.split("/");

        if (scoreParts.length !== 2) {
            return {halfTime: 1, fullTime: 1}
        }

        return {
            halfTime: scoreParts[0].trim() === "X" ? 1.5 : parseInt(scoreParts[0].trim()),
            fullTime: scoreParts[1].trim() === "X" ? 1.5 : parseInt(scoreParts[1].trim())
        }
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
        flex: 0
    } as ViewStyle,
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    }
})
