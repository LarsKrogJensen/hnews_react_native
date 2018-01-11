import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "../OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {BetOfferTypes} from "components/betOffers/BetOfferTypes";
import {OutcomeEntity} from "model/OutcomeEntity";
import {BetOfferType} from "api/typings";
import {OutcomeTypes} from "components/betOffers/OutcomeTypes";

interface ExternalProps {
    outcomes: number[]
    eventId: number,
    type: BetOfferType
}

interface StateProps {
    outcomes: OutcomeEntity[]
}

type Props = StateProps & ExternalProps

class BetOfferGroupComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.outcomes.join() !== this.props.outcomes.join()) return true;

        return false
    }

    public render() {
        const {outcomes, type, eventId} = this.props

        if (type.id === BetOfferTypes.OverUnder) {
            return this.renderOverUnder(outcomes, eventId)
        }

        if (type.id === BetOfferTypes.CorrectScore) {
            return this.renderCorrectScore(outcomes, eventId)
        }

        return null
    }

    private renderOverUnder(outcomes: OutcomeEntity[], eventId: number) {
        // render 2 columns first with over and second under
        const over = outcomes.filter(o => o.type === OutcomeTypes.Over && o.line).sort((o1, o2) => o1.line!! - o2.line!!)
        const under = outcomes.filter(o => o.type === OutcomeTypes.Under && o.line).sort((o1, o2) => o1.line!! - o2.line!!)

        return (
            <View style={styles.rowLayout}>
                <View style={styles.columnLayout}>
                    {over.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={{marginVertical: 2}}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {under.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={{marginVertical: 2}}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
            </View>
        )
    }

    private renderCorrectScore(outcomes: OutcomeEntity[], eventId: number) {
        // render 3 columns first with home win, second draw and third away win
        type OutcomeWithScore = OutcomeEntity & { homeScore: number, awayScore: number }
        const outcomesWithScore: OutcomeWithScore[] = outcomes.map(outcome => ({...outcome, ...this.parseScore(outcome.label)}))

        const home = outcomesWithScore.filter(o => o.homeScore > o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)
        const draw = outcomesWithScore.filter(o => o.homeScore === o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)
        const away = outcomesWithScore.filter(o => o.homeScore < o.awayScore).sort((o1, o2) => o1.homeScore - o2.homeScore)

        const itemStyle: ViewStyle = {marginVertical: 2, flex: 0}
        return (
            <View style={styles.rowLayout}>
                <View style={styles.columnLayout}>
                    {home.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={itemStyle}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {draw.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={itemStyle}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {away.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={itemStyle}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
            </View>
        )
    }

    private parseScore(scoreLabel: string): { homeScore: number, awayScore: number } {
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

})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcomes: inputProps.outcomes.map(outId => state.entityStore.outcomes.get(outId)).filter(o => o)
})

export const BetOfferGroupItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferGroupComponent)

