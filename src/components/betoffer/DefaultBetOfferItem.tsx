import * as React from "react"
import {ComponentClass, ReactNode} from "react"
import {BetOfferEntity} from "entity/BetOfferEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import {Orientation} from "lib/device";
import OutcomeItem from "../OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import Touchable from "components/Touchable";
import {BetOfferTypes} from "components/betoffer/BetOfferTypes";
import {EventEntity} from "entity/EventEntity";
import {WinnerBetOfferItem} from "components/betoffer/WinnerBetOfferItem";
import {NavigationScreenProp} from "react-navigation";
import {navigate} from "lib/navigate";

interface ExternalProps {
    betofferId: number
    orientation?: Orientation
    navigation: NavigationScreenProp<{}>,
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
                betoffer.betOfferType.id === BetOfferTypes.Position ||
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

    private renderOutcomes = (outcomes: ReadonlyArray<number>,
                           betOffer: BetOfferEntity,
                           event: EventEntity,
                           outcomeStyle: ViewStyle): ReactNode[] => {

        const {navigation} = this.props

        if (outcomes.length > 3 && event.type === "ET_COMPETITION" || betOffer.betOfferType.id === BetOfferTypes.Position) {
            const items: ReactNode[] = []
            items.push((
                <WinnerBetOfferItem key="12" eventId={event.id} outcomes={[...outcomes]} limit={4}/>
            ))
            // items.push(<Text key="12">Winner</Text>)

            items.push((
                <Touchable key={123345} onPress={() => navigate(navigation, "Event",{eventId: event.id})}>
                    <Text style={{textAlign: "center", padding: 8}}>View all {outcomes.length} participants</Text>
                </Touchable>))
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

