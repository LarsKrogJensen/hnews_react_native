import * as React from "react"
import {ComponentClass} from "react"
import {Text, TextStyle, View, ViewStyle} from "react-native";
import {Orientation} from "lib/device";
import Touchable from "components/Touchable";
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import PlatformIcon from "components/PlatformIcon";
import {BetOfferEntity} from "model/BetOfferEntity";


interface ExternalProps {
    outcomeId: number
    eventId: number
    betOfferId: number
    orientation: Orientation,
    style: ViewStyle
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

class OutcomeItem extends React.PureComponent<Props, State> {
    private timer?: number;

    constructor(props, context) {
        super(props, context);
        this.state = {
            oddsChange: 0
        }
    }


    //
    // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
    //
    // }

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
        const {outcome, event, orientation, betOffer: {suspended}} = this.props;
        const {oddsChange} = this.state
        const outcomeLabel = this.formatOutcomeLabel(outcome, event);

        const height = orientation === Orientation.Portrait ? 38 : 48
        const viewStyle = orientation === Orientation.Portrait ? portraitViewStyle : landscapeViewStyle
        const touchStyle: ViewStyle = {
            ...touchBaseStyle,
            height,
            ...this.props.style
        }

        if (suspended) {
            return (
                <View style={[touchStyle, viewStyle, {backgroundColor: "#BBBBBB"}]}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[labelStyle, {color: "#959595"}]}>{outcomeLabel}</Text>
                </View>
            )
        }
        
        return (
            <Touchable key={outcome.id} style={touchStyle} onPress={() => console.log("Pressed")}>
                <View style={viewStyle}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={labelStyle}>{outcomeLabel}</Text>
                    {this.renderOddsChange(oddsChange)}
                    <Text style={oddsStyle}>{outcome.odds / 1000}</Text>
                </View>
            </Touchable>
        )
    }

    private formatOutcomeLabel(outcome: OutcomeEntity, event: EventEntity): string {
        if (outcome.type === "OT_CROSS")
            return "Draw"
        if (outcome.type === "OT_ONE")
            return event.homeName;
        if (outcome.type === "OT_TWO")
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

const touchBaseStyle: ViewStyle = {
    marginRight: 4,
    flex: 1,
    borderRadius: 3
}

const viewBaseStyle: ViewStyle = {
    height: 38,
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#00ADC9',
    borderRadius: 3
}

const portraitViewStyle: ViewStyle = {
    ...viewBaseStyle,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
}

const landscapeViewStyle: ViewStyle = {
    ...viewBaseStyle,
    flex: 1,
    flexDirection: "column-reverse",
    alignItems: 'center'
}

const labelStyle: TextStyle = {
    color: "#DEF5FA",
    flex: 1,
    fontSize: 12
}

const oddsStyle: TextStyle = {
    color: "white",
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "bold"
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcome: state.entityStore.outcomes.get(inputProps.outcomeId),
    event: state.entityStore.events.get(inputProps.eventId),
    betOffer: state.entityStore.betoffers.get(inputProps.betOfferId)
})


const OutcomeItemWithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(OutcomeItem)

export default OutcomeItemWithData