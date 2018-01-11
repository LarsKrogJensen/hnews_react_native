import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import OutcomeItem from "../OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {BetOfferTypes} from "components/betOffers/BetOfferTypes";
import {OutcomeEntity} from "model/OutcomeEntity";
import {BetOfferType} from "api/typings";
import {OutcomeTypes} from "components/betOffers/OutcomeTypes";
import autobind from "autobind-decorator";
import {EventEntity} from "model/EventEntity";

interface ExternalProps {
    outcomes: number[]
    eventId: number,
    type: BetOfferType
}

interface StateProps {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type Props = StateProps & ExternalProps

class BetOfferGroupComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.outcomes.join() !== this.props.outcomes.join()) return true;

        return false
    }

    public render() {
        const {outcomes, type, eventId, event} = this.props

        switch (type.id) {
            case BetOfferTypes.OverUnder:
                return this.renderOverUnder(outcomes, eventId)
            case BetOfferTypes.CorrectScore:
                return this.renderCorrectScore(outcomes, eventId)
            case BetOfferTypes.HalfTimeFullTime:
                return this.renderHalfTimeFullTime(outcomes, eventId)
            case BetOfferTypes.ThreeWayHandicap:
                return this.renderThreeWayHandicap(outcomes, eventId)
            case BetOfferTypes.AsianHandicap:
                return this.renderAsianHandicap(outcomes, event)
            default:
                return <Text>BetOffer type '{type.englishName}'seems not implemented yet</Text>
        }
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

    private renderHalfTimeFullTime(outcomes: OutcomeEntity[], eventId: number) {
        // render 3 columns first with home win, second draw and third away win
        type OutcomeWithHtFt = OutcomeEntity & { halfTime: number, fullTime: number }
        const outcomesWithHtFt: OutcomeWithHtFt[] = outcomes.map(outcome => ({...outcome, ...this.parseHtFt(outcome.label)}))

        const home = outcomesWithHtFt.filter(o => o.fullTime === 1).sort((o1, o2) => o1.halfTime - o2.halfTime)
        const draw = outcomesWithHtFt.filter(o => o.fullTime === 1.5).sort((o1, o2) => o1.halfTime - o2.halfTime)
        const away = outcomesWithHtFt.filter(o => o.fullTime === 2).sort((o1, o2) => o1.halfTime - o2.halfTime)

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

    private renderThreeWayHandicap(outcomes: OutcomeEntity[], eventId: number) {
        type HandicapGroup = {
            handicap: number,
            outcomes: OutcomeEntity[]
        }

        const groups: HandicapGroup[] = outcomes.reduceRight((reduced, outcome) => {
            let group = reduced.find(g => g.handicap === outcome.line)
            if (!group) {
                group = {handicap: outcome.line!, outcomes: []}
                reduced.push(group)
            }
            group.outcomes.push(outcome)
            return reduced
        }, [] as HandicapGroup[])
            .sort((g1, g2) => g2.handicap - g1.handicap)

        const itemStyle: ViewStyle = {marginVertical: 2, flex: 1}
        return (
            <View style={styles.columnLayout}>
                {groups.map(group => (
                    <View key={"handicap-" + group.handicap} style={styles.columnLayout}>
                        <Text style={{
                            fontSize: 16,
                            marginVertical: 4
                        }}>Starts {this.formatHandicapTitle(group.handicap)}</Text>
                        <View style={styles.rowLayout}>
                            {group.outcomes.sort(this.sortThreeWay).map(outcome => (
                                <OutcomeItem
                                    key={outcome.id}
                                    style={itemStyle}
                                    outcomeId={outcome.id}
                                    eventId={eventId}
                                    betOfferId={outcome.betOfferId}/>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    private renderAsianHandicap(outcomes: OutcomeEntity[], event: EventEntity) {
        // render 2 columns first with over and second under
        const home = outcomes.filter(o => o.label === event.homeName && o.line).sort((o1, o2) => o1.line!! - o2.line!!)
        const away = outcomes.filter(o => o.label === event.awayName && o.line).sort((o1, o2) => o2.line!! - o1.line!!)

        return (
            <View style={styles.rowLayout}>
                <View style={styles.columnLayout}>
                    {home.map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={{marginVertical: 2}}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
                <View style={styles.columnLayout}>
                    {away.map(outcome => (
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

    @autobind
    private sortThreeWay(outcome1: OutcomeEntity, outcome2: OutcomeEntity): number {
        return this.threeWayLabelToNumber(outcome1.label) - this.threeWayLabelToNumber(outcome2.label)
    }

    private threeWayLabelToNumber(label: string): number {
        return label.toLowerCase() === "x" ? 1.5 : parseInt(label)
    }

    private formatHandicapTitle(handicap: number): string {
        if (handicap > 0) {
            return `${handicap / 1000}-0`
        }

        return `0${handicap / 1000}`
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
    outcomes: inputProps.outcomes.map(outId => state.entityStore.outcomes.get(outId)).filter(o => o),
    event: state.entityStore.events.get(inputProps.eventId)
})

export const BetOfferGroupItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferGroupComponent)

