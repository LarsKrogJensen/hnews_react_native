import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {StyleSheet, Text, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type HandicapGroup = {
    handicap: number,
    outcomes: OutcomeEntity[]
}


export class ThreeWayHandicapBetOfferGroupItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        const groups: HandicapGroup[] = outcomes.reduceRight((reduced, outcome) => {
            let group = reduced.find(g => g.handicap === outcome.line)
            if (!group) {
                group = {handicap: outcome.line!, outcomes: []}
                reduced.push(group)
            }
            group.outcomes.push(outcome)
            return reduced
        }, [] as HandicapGroup[])
            .sort((g1, g2) => g2.handicap - g1.handicap)

        const itemStyle: ViewStyle = {marginVertical: 2, flex: 1}
        return (
            <View style={styles.columnLayout}>
                {groups.map(group => (
                    <View key={"handicap-" + group.handicap} style={styles.columnLayout}>
                        <Text style={{
                            fontSize: 16,
                            marginVertical: 4
                        }}>Starts {this.formatHandicapTitle(group.handicap)}</Text>
                        <View style={styles.rowLayout}>
                            {group.outcomes.sort(this.sortThreeWay).map(outcome => (
                                <OutcomeItem
                                    key={outcome.id}
                                    style={itemStyle}
                                    outcomeId={outcome.id}
                                    eventId={event.id}
                                    betOfferId={outcome.betOfferId}/>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    private sortThreeWay = (outcome1: OutcomeEntity, outcome2: OutcomeEntity): number => {
        return this.threeWayLabelToNumber(outcome1.label) - this.threeWayLabelToNumber(outcome2.label)
    }

    private threeWayLabelToNumber = (label: string): number => {
        return label.toLowerCase() === "x" ? 1.5 : parseInt(label)
    }

    private formatHandicapTitle = (handicap: number): string => {
        if (handicap > 0) {
            return `${handicap / 1000}-0`
        }

        return `0${handicap / 1000}`
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
