import * as React from "react"
import {OutcomeEntity} from "entity/OutcomeEntity";
import {EventEntity} from "entity/EventEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";
import {BetOfferEntity} from "entity/BetOfferEntity";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
    betoffers: BetOfferEntity[]
}

interface Player {
    name: string
    outcomes: OutcomeEntity[]
}

export class WinnerBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event, betoffers} = this.props

        const players: Player[] = outcomes.sort((o1, o2) => o2.odds - o1.odds)
            .reduceRight((reduced, outcome) => {
                let player = reduced.find(p => p.name === outcome.label)
                if (!player && outcome.label) {
                    player = {
                        name: outcome.label,
                        outcomes: []
                    }
                    reduced.push(player)
                }

                if (player) {
                    player.outcomes.push(outcome)
                }
                return reduced
            }, [] as Player[])

        return (
            <View style={styles.columnLayout}>
                <View style={[styles.rowLayout, {height: 35, alignItems: "center"}]}>
                    <View style={{flex: 1}}/>
                    {betoffers.map(bo => (
                        <Text key={bo.id} style={[styles.item, styles.label]}>{bo.betOfferType.name}</Text>
                    ))}
                </View>
                {players.map(player => this.renderPlayer(player, event.id, betoffers))}
            </View>
        )
    }

    private renderPlayer = (player: Player, eventId: number, betoffers: BetOfferEntity[]) => {
        return (
            <View key={player.name} style={[styles.rowLayout, {marginVertical: 2, alignItems: "center"}]}>
                <Text style={{flex: 1}}>{player.name}</Text>
                {betoffers.map(bo => {
                    const outcome = player.outcomes.find(o => o.betOfferId == bo.id)
                    if (outcome) {
                        return (
                            <OutcomeItem
                                key={outcome.id}
                                style={{
                                    width: "20%",
                                    flex: 0
                                }}
                                outcomeId={outcome.id}
                                eventId={eventId}
                                betOfferId={outcome.betOfferId}/>
                        )
                    }

                    return <View style={styles.item}/>
                })}
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
    item: {
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
