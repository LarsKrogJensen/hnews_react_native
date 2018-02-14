import * as React from "react"
import {OutcomeEntity} from "model/OutcomeEntity";
import {EventEntity} from "model/EventEntity";
import {OutcomeCriterion} from "api/typings";
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import OutcomeItem from "components/OutcomeItem";


interface Props {
    outcomes: OutcomeEntity[]
    event: EventEntity
}

type Player = {
    name: string,
    outcomes: OutcomeEntity[]
}

type Team = {
    name: string
    players: Map<number, Player>
}

export class GoalScorerItem extends React.Component<Props> {

    render(): React.ReactNode {
        const {outcomes, event} = this.props

        const outcomeCriterions: Map<number, OutcomeCriterion> = new Map()
        const homeTeam: Team = {
            name: event.homeName,
            players: new Map()
        }
        const awayTeam: Team = {
            name: event.awayName,
            players: new Map()
        }

        for (let outcome of outcomes) {
            let player = outcome.homeTeamMember ? this.resolvePlayer(outcome, homeTeam) : this.resolvePlayer(outcome, awayTeam)
            player.outcomes.push(outcome)

            if (outcome.criterion && !outcomeCriterions.has(outcome.criterion.type)) {
                outcomeCriterions.set(outcome.criterion.type, outcome.criterion)
            }
        }

        const criterions = [...outcomeCriterions.values()].sort((a, b) => a.type - b.type)
        return (
            <View style={styles.columnLayout}>
                {this.renderTeamHeader(homeTeam, criterions)}
                {this.renderTeamPlayers([...homeTeam.players.values()], criterions)}
                {this.renderTeamHeader(awayTeam, criterions)}
                {this.renderTeamPlayers([...awayTeam.players.values()], criterions)}
            </View>
        )
    }

    private renderTeamHeader(team: Team, criterions: OutcomeCriterion[]) {
        return [
            <Text key={team.name + "-title"} style={styles.teamStyle}>{team.name}</Text>,
            <View key={team.name + "-header"} style={[styles.rowLayout, {height: 35, alignItems: "center", paddingHorizontal: 8}]}>
                {
                    criterions.map(criterion => (
                            <Text key={criterion.type} style={[styles.item, styles.label]}>{criterion.name}</Text>
                        )
                    )
                }
            </View>
        ]
    }

    private renderTeamPlayers = (players: Player[], criterions: OutcomeCriterion[]) => {
        return players
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(player => this.renderPlayer(player, criterions))
    }

    private renderPlayer = (player: Player, criterions: OutcomeCriterion[]): React.ReactNode => {
        return (
            <View key={player.name} style={[styles.columnLayout, styles.playerBox]}>
                <Text style={styles.playerNameStyle}>{player.name}</Text>
                <View style={styles.rowLayout}>
                    {
                        criterions.map(criterion => {
                            let outcome = player.outcomes.find(o => o.criterion!.type === criterion.type);

                            if (outcome) {
                                return <OutcomeItem key={criterion.type}
                                                    outcomeId={outcome.id}
                                                    eventId={this.props.event.id}
                                                    betOfferId={outcome.betOfferId}/>
                                // return <Text key={criterion.type} style={styles.itemStyle}>OUTCOME</Text>
                            } else {
                                return <View key={criterion.type} style={styles.item}/>
                            }
                        })
                    }
                </View>
            </View>
        )
    }

    private resolvePlayer = (outcome: OutcomeEntity, team: Team): Player => {
        let current = team.players.get(outcome.participantId!);
        if (!current) {
            current = {
                name: outcome.label,
                outcomes: []
            }
            team.players.set(outcome.participantId!, current)
        }
        return current
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
    label: {
        textAlign: "center",
        marginRight: 4,
        fontSize: 14,
        fontWeight: "bold"
    } as TextStyle,
    item: {
        flex: 1
    } as ViewStyle,
    teamStyle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 8,
        alignSelf: "center"
    } as TextStyle,
    playerNameStyle: {
        fontSize: 16,
        marginBottom: 8
    } as TextStyle,
    playerBox: {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1
    }


})