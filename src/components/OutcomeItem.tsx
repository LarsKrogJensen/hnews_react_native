import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {Orientation} from "lib/device";
import Touchable from "components/Touchable";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import PlatformIcon from "components/PlatformIcon";
import {BetOfferEntity} from "model/BetOfferEntity";
import {BetOfferTypes} from "components/betoffer/BetOfferTypes";
import {OutcomeTypes} from "components/betoffer/OutcomeTypes";


interface ExternalProps {
    outcomeId: number
    eventId: number
    betOfferId: number
    orientation?: Orientation,
    style?: ViewStyle
    overrideShowLabel?: boolean
}

interface StateProps {
    outcome: OutcomeEntity
    event: EventEntity
    betOffer: BetOfferEntity
}

type Props = StateProps & ExternalProps

interface State {
    oddsChange: number
}

class OutcomeItem extends React.Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        orientation: Orientation.Portrait
    }
    state: State = {
        oddsChange: 0
    }

    private timer?: number;


    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if (nextProps.outcomeId !== this.props.outcomeId) return true
        if (nextProps.orientation !== this.props.orientation) return true
        if (nextProps.outcome.odds !== this.props.outcome.odds) return true
        if (nextProps.betOffer !== this.props.betOffer) return true
        if (nextProps.betOffer.suspended !== this.props.betOffer.suspended) return true
        if (nextState.oddsChange !== this.state.oddsChange) return true

        return false
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = undefined
        }

        let oddsChange = nextProps.outcome.odds - this.props.outcome.odds;
        this.setState(
            {
                oddsChange: oddsChange
            })

        if (oddsChange !== 0) {
            this.timer = setInterval(() => this.setState({oddsChange: 0}), 10000);
        }
    }

    componentWillUnmount(): void {
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = undefined
        }
    }

    public render() {
        const {outcome, event, orientation, betOffer, style, overrideShowLabel} = this.props;
        const {oddsChange} = this.state
        // console.log("OutcomeItem.render: " + outcome.id)

        if (!outcome || !betOffer) return null;

        const outcomeLabel = this.formatOutcomeLabel(outcome, betOffer, event, overrideShowLabel);

        const height = orientation === Orientation.Portrait ? 38 : 48
        const viewStyle = orientation === Orientation.Portrait ? styles.portrait : styles.landscape
        const touchStyle = [styles.touchBase, {height}, style || {}]


        if (betOffer.suspended || outcome.odds === 1000) {
            return (
                <View style={touchStyle}>
                    <View style={[styles.viewBase, viewStyle, {backgroundColor: "#BBBBBB"}]}>
                        <Text numberOfLines={1} ellipsizeMode="tail"
                              style={[styles.label, {color: "#959595"}]}>{outcomeLabel}</Text>
                    </View>
                </View>                                                                            
            )
        }

        return (
            <Touchable key={outcome.id} style={touchStyle} onPress={() => console.log("Pressed")}>
                <View style={[styles.viewBase, viewStyle, !outcomeLabel ? {justifyContent: "center"} : {}]}>
                    {outcomeLabel &&
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.label}>{outcomeLabel}</Text>}
                    {this.renderOddsChange(oddsChange)}
                    <Text
                        style={[styles.odds, !outcomeLabel ? {marginLeft: 0} : {}]}>{(outcome.odds / 1000).toFixed(2)}</Text>
                </View>
            </Touchable>
        )
    }

    private formatOutcomeLabel(outcome: OutcomeEntity, betoffer: BetOfferEntity, event: EventEntity, overrideShowLabel?: boolean): string | undefined {
        if ((betoffer.betOfferType.id === BetOfferTypes.OverUnder ||
                betoffer.betOfferType.id === BetOfferTypes.Handicap ||
                betoffer.betOfferType.id === BetOfferTypes.AsianOverUnder) && outcome.line) {
            return outcome.label + " " + outcome.line / 1000
        }
        if (!overrideShowLabel && (betoffer.betOfferType.id === BetOfferTypes.HeadToHead ||
            betoffer.betOfferType.id === BetOfferTypes.Winner ||
            betoffer.betOfferType.id === BetOfferTypes.Position ||
            betoffer.betOfferType.id === BetOfferTypes.GoalScorer)) {
            return undefined
        }
        if (betoffer.betOfferType.id === BetOfferTypes.DoubleChance) {
            if (outcome.type === OutcomeTypes.HomeOrDraw)
                return event.homeName + " or Draw"
            if (outcome.type === OutcomeTypes.HomeOrAway)
                return event.homeName + " or " + event.awayName
            if (outcome.type === OutcomeTypes.DrawOrAway)
                return event.awayName + " or Draw"
        }
        if (betoffer.betOfferType.id === BetOfferTypes.AsianHandicap) {
            return outcome.label + (outcome.line! > 0 ? "  +" : "  ") + ((outcome.line!) / 1000)
        }

        if (outcome.type === OutcomeTypes.Draw)
            return "Draw"
        if (outcome.type === OutcomeTypes.Home)
            return event.homeName;
        if (outcome.type === OutcomeTypes.Away)
            return event.awayName;

        return outcome.label
    }

    private renderOddsChange(oddsChange: number) {
        if (oddsChange > 0) {
            return <PlatformIcon name="arrow-round-up" size={16} color="green"/>
        } else if (oddsChange < 0) {
            return <PlatformIcon name="arrow-round-down" size={16} color="red"/>
        }

        return null
    }
}

const styles = StyleSheet.create({
    touchBase: {
        marginRight: 4,
        flex: 1,
        borderRadius: 3
    } as ViewStyle,
    viewBase: {
        height: 38,
        flex: 1,
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#00ADC9',
        borderRadius: 3
    } as ViewStyle,
    portrait: {
        //...viewBaseStyle,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }  as ViewStyle,
    landscape: {
        //...viewBaseStyle,
        flex: 1,
        flexDirection: "column-reverse",
        alignItems: 'center'
    } as ViewStyle,
    label: {
        color: "#DEF5FA",
        flex: 1,
        fontSize: 12
    } as TextStyle,
    odds: {
        color: "white",
        marginLeft: 8,
        fontSize: 12,
        fontWeight: "bold"
    } as TextStyle


})


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcome: state.entityStore.outcomes.get(inputProps.outcomeId),
    event: state.entityStore.events.get(inputProps.eventId),
    betOffer: state.entityStore.betoffers.get(inputProps.betOfferId)
})


const OutcomeItemWithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(OutcomeItem)

export default OutcomeItemWithData