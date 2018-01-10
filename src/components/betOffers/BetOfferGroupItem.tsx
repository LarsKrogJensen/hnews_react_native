import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, View, ViewStyle} from "react-native";
import autobind from "autobind-decorator";
import {Orientation} from "lib/device";
import OutcomeItem from "../OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {BetOfferTypes} from "components/betOffers/BetOfferTypes";
import {OutcomeEntity} from "model/OutcomeEntity";
import {BetOfferType} from "api/typings";
import {OutcomeTypes} from "components/betOffers/OutcomeTypes";

interface ExternalProps {
    betofferIds: number[]
    eventId: number,
    type: BetOfferType
}

interface StateProps {
    outcomes: OutcomeEntity[]
}

type Props = StateProps & ExternalProps

class BetOfferGroupComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.betofferIds.join() !== this.props.betofferIds.join()) return true;
        if (nextProps.outcomes.map(o => o.id).join() !== this.props.outcomes.map(o => o.id).join()) return true;

        return false
    }

    public render() {
        const {outcomes, type, eventId} = this.props


        if (type.id === BetOfferTypes.OverUnder) {
            return this.renderOverUnder(outcomes, eventId)
        }


        return null
    }

    @autobind
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
                            orientation={Orientation.Portrait}
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
                            orientation={Orientation.Portrait}
                            outcomeId={outcome.id}
                            eventId={eventId}
                            betOfferId={outcome.betOfferId}/>
                    ))}
                </View>
            </View>
        )
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
        alignItems: "stretch"

    } as ViewStyle,

})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcomes: inputProps.betofferIds.map(boId => state.entityStore.betoffers.get(boId))
        .filter(bo => bo)
        .map(bo => bo.outcomes)
        .map(outcomes => outcomes.map(outId => state.entityStore.outcomes.get(outId)))
        .filter(o => o)
        .reduceRight<OutcomeEntity[]>((reduced, outs) => {
            reduced.push(...outs)
            return reduced
        }, [])
})

export const BetOfferGroupItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferGroupComponent)

