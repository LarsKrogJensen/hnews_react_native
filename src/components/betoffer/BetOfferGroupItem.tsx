import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import OutcomeItem from "../OutcomeItem"
import {BetOfferTypes} from "components/betoffer/BetOfferTypes";
import {OutcomeEntity} from "model/OutcomeEntity";
import {BetOfferType} from "api/typings";
import {OutcomeTypes} from "components/betoffer/OutcomeTypes";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {GoalScorerItem} from "components/betoffer/GoalScorerItem";
import {WinnerBetOfferGroupItem} from "components/betoffer/WinnerBetOfferGroupItem";
import {BetOfferEntity} from "model/BetOfferEntity";
import {PositionBetOfferGroupItem} from "components/betoffer/PositionBetOfferGroupItem";
import {OverUnderBetOfferGroupItem} from "components/betoffer/OverUnderBetOfferGroupItem";
import {CorrectScoreOfferGroupItem} from "components/betoffer/CorrectScoreBetOfferGroupItem";
import {HalfTimeFullTimeBetOfferGroupItem} from "components/betoffer/HalfTimeFullTimeBetOfferGroupItem";
import {ThreeWayHandicapBetOfferGroupItem} from "components/betoffer/ThreeWayHandicapBetOfferGroupItem";

interface ExternalProps {
    outcomes: number[]
    betOfferIds: number[],
    eventId: number,
    type: BetOfferType
}

interface StateProps {
    outcomes: OutcomeEntity[]
    event: EventEntity,
    betOffers: BetOfferEntity[]
}

type Props = StateProps & ExternalProps

class BetOfferGroupComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.outcomes.join() !== this.props.outcomes.join()) return true;

        return false
    }

    public render() {
        const {outcomes, type, eventId, event, betOffers} = this.props

        switch (type.id) {
            case BetOfferTypes.Winner:
                return <WinnerBetOfferGroupItem outcomes={outcomes} event={event} betoffers={betOffers}/>
            case BetOfferTypes.Position:
                return <PositionBetOfferGroupItem outcomes={outcomes} event={event} betoffers={betOffers}/>
            case BetOfferTypes.OverUnder:
            case BetOfferTypes.AsianOverUnder:
                return <OverUnderBetOfferGroupItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.CorrectScore:
                return <CorrectScoreOfferGroupItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.HalfTimeFullTime:
                return <HalfTimeFullTimeBetOfferGroupItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.ThreeWayHandicap:
                return <ThreeWayHandicapBetOfferGroupItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.GoalScorer:
                return <GoalScorerItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.AsianHandicap:
            case BetOfferTypes.Handicap:
                return this.renderHandicap(outcomes, event)
            case BetOfferTypes.HeadToHead:
                return this.renderHeadToHead(outcomes, eventId)
            default:
                return <Text>BetOffer type '{type.name}' seems not implemented yet</Text>
        }
    }

    private renderHeadToHead(outcomes: OutcomeEntity[], eventId: number) {
        type HeadToHead = {
            paricipant: string,
            yes?: OutcomeEntity,
            no?: OutcomeEntity,
            betOfferId: number
        }

        const rows: HeadToHead[] = outcomes.reduceRight((reduced, outcome) => {
            let h2h = reduced.find(o => o.betOfferId === outcome.betOfferId)
            if (!h2h) {
                h2h = {
                    betOfferId: outcome.betOfferId,
                    paricipant: ""
                }
                reduced.push(h2h)
            }

            if (outcome.type === OutcomeTypes.Yes) {
                h2h.paricipant = outcome.participant || h2h.paricipant
                h2h.yes = outcome
            } else {
                h2h.paricipant = outcome.participant || h2h.paricipant
                h2h.no = outcome
            }

            return reduced
        }, [] as HeadToHead[]).sort((h1, h2) => h1.paricipant.localeCompare(h2.paricipant))

        const itemStyle: ViewStyle = {
            width: "20%",
            flex: 0
        }

        const labelStyle: TextStyle = {
            textAlign: "center",
            marginRight: 4,
            fontSize: 14,
            fontWeight: "bold"
        }

        const yesOut = rows.find(r => r.yes !== undefined)
        const yesLabel = yesOut ? yesOut.yes!.label : "Yes"
        const noOut = rows.find(r => r.yes !== undefined)
        const noLabel = noOut ? noOut.no!.label : "No"

        return (
            <View style={styles.columnLayout}>
                <View style={[styles.rowLayout, {height: 35, alignItems: "center"}]}>
                    <View style={{flex: 1}}/>
                    <Text style={[itemStyle, labelStyle]}>{yesLabel}</Text>
                    <Text style={[itemStyle, labelStyle]}>{noLabel}</Text>
                </View>
                {rows.map(h2h => (
                    <View key={h2h.betOfferId} style={[styles.rowLayout, {marginVertical: 2, alignItems: "center"}]}>
                        <Text style={{flex: 1}}>{h2h.paricipant}</Text>
                        {
                            h2h.yes ? (
                                    <OutcomeItem
                                        style={itemStyle}
                                        outcomeId={h2h.yes!.id}
                                        eventId={eventId}
                                        betOfferId={h2h.yes!.betOfferId}/>
                                )
                                : <View style={itemStyle}/>
                        }
                        {
                            h2h.no
                                ? (
                                    <OutcomeItem
                                        style={itemStyle}
                                        outcomeId={h2h.no.id}
                                        eventId={eventId}
                                        betOfferId={h2h.no.betOfferId}/>

                                )
                                : <View style={itemStyle}/>

                        }


                    </View>
                ))}
            </View>
        )
    }


    private renderHandicap(outcomes: OutcomeEntity[], event: EventEntity) {
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
    
    
    private formatHandicapTitle = (handicap: number): string => {
        if (handicap > 0) {
            return `${handicap / 1000}-0`
        }

        return `0${handicap / 1000}`
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
    betOffers: inputProps.betOfferIds.map(id => state.entityStore.betoffers.get(id)).filter(bo => bo),
    event: state.entityStore.events.get(inputProps.eventId)
})

export const BetOfferGroupItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferGroupComponent)

