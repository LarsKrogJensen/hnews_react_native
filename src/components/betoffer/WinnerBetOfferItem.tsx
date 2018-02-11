import * as React from "react"
import {ComponentClass} from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import {AppStore} from "store/store";
import {connect} from "react-redux";

interface ExternalProps {
    outcomes: number[]
    eventId: number
    limit: number
}

interface StateProps {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type Props = StateProps & ExternalProps

class WinnerBetOfferComponent extends React.Component<Props> {

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.eventId != this.props.eventId) return true
        if (nextProps.outcomes.length != this.props.outcomes.length) return true

        return false
    }

    render(): React.ReactNode {
        const {outcomes, event, limit} = this.props

        return (
            <View style={styles.columnLayout}>
                {outcomes
                    .sort((o1, o2) => o1.odds - o2.odds)
                    .filter(o => o.odds > 1000)
                    .slice(0, limit ? Math.min(limit, outcomes.length - 1) : outcomes.length - 1)
                    .map(outcome => (
                        <OutcomeItem
                            key={outcome.id}
                            style={{marginVertical: 2}}
                            outcomeId={outcome.id}
                            eventId={event.id}
                            betOfferId={outcome.betOfferId}
                            overrideShowLabel/>
                    ))}
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
        alignItems: "stretch",
        justifyContent: "flex-start"
    } as ViewStyle,
})

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    outcomes: inputProps.outcomes.map(outId => state.entityStore.outcomes.get(outId)).filter(o => o),
    event: state.entityStore.events.get(inputProps.eventId)
})

export const WinnerBetOfferItem: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(WinnerBetOfferComponent)