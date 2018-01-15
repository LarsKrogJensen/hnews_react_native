import * as React from "react"
import {ComponentClass} from "react"
import {BetOfferEntity} from "model/BetOfferEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {Orientation} from "lib/device";
import OutcomeItem from "../OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import Touchable from "components/Touchable";
import {BetOfferTypes} from "components/betOffers/BetOfferTypes";
import {EventEntity} from "model/EventEntity";

interface ExternalProps {
    betofferId: number
    orientation?: Orientation
}

interface StateProps {
    betoffer?: BetOfferEntity
    event?: EventEntity
}

type Props = StateProps & ExternalProps

class DefaultBetOfferItemComponent extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        orientation: Orientation.Portrait
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (!nextProps.betoffer) return true
        if (!this.props.betoffer) return true

        if (nextProps.betofferId !== this.props.betofferId) return true;
        if (nextProps.orientation !== this.props.orientation) return true;
        if (nextProps.betoffer.outcomes.length !== this.props.betoffer.outcomes.length) return true
        if (nextProps.betoffer.outcomes.join() !== this.props.betoffer.outcomes.join()) return true

        return false
    }

    public render() {
        const {betoffer, event} = this.props
        // console.log("DefaultBetOfferItem.render id: " + (bo && bo.id))

        if (betoffer && event) {
            const outcomes: number[] = [...betoffer.outcomes] || []
            let layout = styles.rowLayout
            const outcomeStyle: ViewStyle = {}

            if (betoffer.betOfferType.id === BetOfferTypes.DoubleChance ||
                betoffer.betOfferType.id === BetOfferTypes.Winner ||
                outcomes.length > 3) {
                layout = styles.columnLayout
                outcomeStyle.marginBottom = 4
            }

            return (
                <View style={layout}>
                    {this.renderOutcomes(outcomes, betoffer, event, outcomeStyle)}
                </View>
            )
        }

        return null
    }

    @autobind
    private renderOutcomes(outcomes: ReadonlyArray<number>,
                           betOffer: BetOfferEntity,
                           event: EventEntity,
                           outcomeStyle: ViewStyle) {

        if (outcomes.length > 3 && event.type === "ET_COMPETITION") {
            const items = outcomes.slice(0, 4).map(outcomeId => (
                <OutcomeItem
                    style={outcomeStyle}
                    key={outcomeId}
                    outcomeId={outcomeId}
                    eventId={betOffer.eventId}
                    betOfferId={betOffer.id}/>
            ))

            items.push(<Touchable key={123345}><Text style={{textAlign: "center", padding: 8}}>View
                all {outcomes.length} participants</Text></Touchable>)
            return items;
        }

        return betOffer.outcomes.map(outcomeId => (
            <OutcomeItem
                key={outcomeId}
                style={outcomeStyle}
                orientation={this.props.orientation}
                outcomeId={outcomeId}
                eventId={betOffer.eventId}
                betOfferId={betOffer.id}/>
        ))
    }
}

const styles = StyleSheet.create({
    rowLayout: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center"
    } as ViewStyle,
    columnLayout: {
        flex: 1,
        flexDirection: 'column',
        alignItems: "stretch",

    } as ViewStyle,

})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    let betoffer = inputProps.betofferId && state.entityStore.betoffers.get(inputProps.betofferId) || undefined;

    return {
        betoffer: betoffer,
        event: betoffer && state.entityStore.events.get(betoffer.eventId)
    }
}

export const DefaultBetOfferItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(DefaultBetOfferItemComponent)

