import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

export class CorrectScoreOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props
        // render 3 columns first with home win, second draw and third away win
        type OutcomeWithScore = OutcomeEntity & { homeScore: number, awayScore: number }
        const outcomesWithScore: OutcomeWithScore[] = outcomes.map(outcome => ({...outcome, ...this.parseScore(outcome.label)}))

        const home = outcomesWithScore.filter(o => o.homeScore > o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)
        const draw = outcomesWithScore.filter(o => o.homeScore === o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)
        const away = outcomesWithScore.filter(o => o.homeScore < o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)

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
                {!!draw.length && <View style={styles.columnLayout}>
                    {draw.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={styles.outcome}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                }
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

    private parseScore = (scoreLabel: string): { homeScore: number, awayScore: number } => {
        let scoreParts: string[] = scoreLabel.split("-");

        if (scoreParts.length !== 2) {
            return {homeScore: 0, awayScore: 0}
        }

        return {
            homeScore: parseInt(scoreParts[0].trim()),
            awayScore: parseInt(scoreParts[1].trim())
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
