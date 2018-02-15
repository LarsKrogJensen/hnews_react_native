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
import {HandicapBetOfferGroupItem} from "components/betoffer/HandicapBetOfferGroupItem";
import {YesNoBetOfferGroupItem} from "components/betoffer/YesNoBetOfferGroupItem";
import {HeadToHeadBetOfferGroupItem} from "components/betoffer/HeadToHeadOfferGroupItem";

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
                return <HandicapBetOfferGroupItem outcomes={outcomes} event={event}/>
            case BetOfferTypes.HeadToHead:
                const isYesNoFlavor = outcomes.find(ot => ot.type === OutcomeTypes.Yes)
                if (isYesNoFlavor) {
                    return <YesNoBetOfferGroupItem outcomes={outcomes} event={event}/>
                } else {
                    return <HeadToHeadBetOfferGroupItem outcomes={outcomes} event={event}/>
                }
            default:
                return <Text>BetOffer type '{type.name}' seems not implemented yet</Text>
        }
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcomes: inputProps.outcomes.map(outId => state.entityStore.outcomes.get(outId)).filter(o => o),
    betOffers: inputProps.betOfferIds.map(id => state.entityStore.betoffers.get(id)).filter(bo => bo),
    event: state.entityStore.events.get(inputProps.eventId)
})

export const BetOfferGroupItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferGroupComponent)

