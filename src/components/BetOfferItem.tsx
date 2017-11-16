import * as React from "react"
import {BetOfferEntity} from "model/BetOfferEntity";
import {View} from "react-native";
import autobind from "autobind-decorator";
import {Orientation} from "lib/device";
import OutcomeItem from "./OutcomeItem"
import {AppStore} from "store/store";
import {ComponentClass} from "react";
import {connect} from "react-redux";

interface Props {
    betoffer?: BetOfferEntity,
    orientation: Orientation
}

class BetOfferItem extends React.Component<Props> {

    public render() {
        return (
            <View style={{flex: 1, flexDirection: 'row', alignItems: "center"}}>
                {this.renderOutcomes(this.props.betoffer)}
            </View>
        )
    }

    @autobind
    private renderOutcomes(bo?: BetOfferEntity) {
        if (!bo || !bo.outcomes) return undefined
        return bo.outcomes.map(outcomeId => (
            <OutcomeItem
                key={outcomeId}
                orientation={this.props.orientation}
                outcomeId={outcomeId}
                eventId={bo.eventId}/>
        ))
    }
}

interface PropsIn {
    betofferId?: number
    orientation: Orientation
}

const mapStateToProps = (state: AppStore, inputProps: PropsIn) => ({
    betoffer: inputProps.betofferId && state.entityStore.betoffers.get(inputProps.betofferId) || undefined,
    orientation: inputProps.orientation
})


const WithData: ComponentClass<PropsIn> =
    connect<Props, {}, PropsIn>(mapStateToProps)(BetOfferItem)

export default WithData