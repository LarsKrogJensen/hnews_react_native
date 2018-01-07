import * as React from "react"
import {ComponentClass} from "react"
import {BetOfferEntity} from "model/BetOfferEntity";
import {Text, View} from "react-native";
import autobind from "autobind-decorator";
import {Orientation} from "lib/device";
import OutcomeItem from "./OutcomeItem"
import {AppStore} from "store/store";
import {connect} from "react-redux";
import Touchable from "components/Touchable";

interface ExternalProps {
    betofferId?: number
    orientation: Orientation
    showType?: boolean
}

interface StateProps {
    betoffer?: BetOfferEntity
}

type Props = StateProps & ExternalProps

class BetOfferItemComponent extends React.Component<Props> {

    public render() {
        const bo = this.props.betoffer;

        if (bo) {
            const outcomes: number[] = [...bo.outcomes] || []

            return (
                <View>
                    {this.props.showType && <Text>Type: {bo.betOfferType.englishName} Criterion: {bo.criterion.englishLabel}</Text>}
                    <View style={{
                        flex: 1,
                        flexDirection: outcomes.length > 3 ? 'column' : 'row',
                        alignItems: outcomes.length > 3 ? "stretch" : "center"
                    }}>
                        {this.renderOutcomes(outcomes, bo)}
                    </View>
                </View>
            )
        }

        return null
    }

    @autobind
    private renderOutcomes(outcomes: ReadonlyArray<number>, bo: BetOfferEntity) {

        if (outcomes.length > 3) {
            const items = outcomes.slice(0, 4).map(outcomeId => (
                <OutcomeItem
                    style={{marginBottom: 4}}
                    key={outcomeId}
                    orientation={Orientation.Portrait}
                    outcomeId={outcomeId}
                    eventId={bo.eventId}
                    betOfferId={bo.id}/>
            ))

            items.push(<Touchable key={123345}><Text style={{textAlign: "center", padding: 8}}>View
                all {outcomes.length} participants</Text></Touchable>)
            return items;
        }

        return bo.outcomes.map(outcomeId => (
            <OutcomeItem
                key={outcomeId}
                style={{}}
                orientation={this.props.orientation}
                outcomeId={outcomeId}
                eventId={bo.eventId}
                betOfferId={bo.id}/>
        ))
    }
}


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    betoffer: inputProps.betofferId && state.entityStore.betoffers.get(inputProps.betofferId) || undefined
})

export const BetOfferItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferItemComponent)

