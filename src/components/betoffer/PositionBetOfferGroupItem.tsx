import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import {BetOfferEntity} from "model/BetOfferEntity";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
    betoffers: BetOfferEntity[]
}


export class PositionBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event, betoffers} = this.props

        const betoffer = betoffers[0]
        const sorted = outcomes
            .filter(o => o.odds > 1000)
            .sort((o1, o2) => o1.odds - o2.odds)

        return (
            <View style={styles.columnLayout}>
                <View style={[styles.rowLayout, {height: 35, alignItems: "center"}]}>
                    <Text style={[styles.label, {flex: 1, textAlign: "left"}]}>Each Way
                        terms: {betoffer.eachWay && betoffer.eachWay.terms}</Text>
                    <Text style={[styles.outcome, styles.label]}>{betoffer.betOfferType.name}</Text>
                </View>
                {sorted.map(outcome => this.renderPlayer(outcome, event.id))}
            </View>
        )
    }

    private renderPlayer = (outcome: OutcomeEntity, eventId: number) => {
        return (
            <View key={outcome.id} style={[styles.rowLayout, {marginVertical: 2, alignItems: "center"}]}>
                <Text style={{flex: 1}}>{outcome.label}</Text>
                <OutcomeItem
                    key={outcome.id}
                    style={{
                        width: "20%",
                        flex: 0
                    }}
                    outcomeId={outcome.id}
                    eventId={eventId}
                    betOfferId={outcome.betOfferId}/>
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
    outcome: {
        width: "20%",
        flex: 0
    } as ViewStyle,
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    }
})
