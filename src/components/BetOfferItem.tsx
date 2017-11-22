import * as React from "react"
import {BetOfferEntity} from "model/BetOfferEntity";
import {View} from "react-native";
import autobind from "autobind-decorator";
import {Orientation} from "lib/device";
import OutcomeItem from "./OutcomeItem"
import {AppStore} from "store/store";
import {ComponentClass} from "react";
import {connect} from "react-redux";

interface ExternalProps {
    betofferId?: number
    orientation: Orientation
}

interface StateProps {
    betoffer?: BetOfferEntity
}

type Props = StateProps & ExternalProps

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


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    betoffer: inputProps.betofferId && state.entityStore.betoffers.get(inputProps.betofferId) || undefined
})

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(BetOfferItem)

export default WithData