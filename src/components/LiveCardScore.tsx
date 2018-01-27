import * as React from "react"
import {ComponentClass} from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "model/EventEntity";
import {connect} from "react-redux";
import {AppStore} from "store/store";
import {LiveData} from "api/typings";
import {CircularProgress} from 'react-native-circular-progress';
import {renderServe, renderTeamColors} from "components/RenderUtils";


interface ExternalProps {
    eventId: number
    navigation: NavigationScreenProp<{}, {}>,
    asHeader?: boolean
}

interface StateProps {
    event: EventEntity,
    liveData: LiveData
}

type Props = StateProps & ExternalProps

export class LiveCardScoreComponent extends React.Component<Props> {

    public render() {
        const {event, liveData, asHeader} = this.props;
        const teamTextStyle = asHeader ? styles.teamTextHeader : styles.teamText
        return (
            <View style={{flexDirection: "row", marginRight: 8}}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <View style={styles.teamRow}>
                        {renderTeamColors(event.teamColors && event.teamColors.home)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={teamTextStyle}>{event.homeName}</Text>
                        {renderServe(liveData, true)}
                    </View>
                    <View style={[styles.teamRow, {marginBottom: 8}]}>
                        {renderTeamColors(event.teamColors && event.teamColors.away)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={teamTextStyle}>{event.awayName}</Text>
                        {renderServe(liveData, false)}
                    </View>
                </View>
                {this.renderScoreColumns(liveData)}
            </View>
        )
    }

    private renderScoreColumns(liveData: LiveData) {
        const {statistics: stats, score} = liveData

        const scoreStyle = this.props.asHeader ? styles.scoreTextHeader : styles.scoreText
        if (stats && stats.sets && score) {
            const elements: JSX.Element[] = []

            const homeSets = stats.sets.home;
            const awaySets = stats.sets.away;

            for (let i = 0; i < homeSets.length; i++) {
                const home = homeSets[i];
                const away = awaySets[i];

                elements.push(
                    <View key={"sets" + i + liveData.eventId}
                          style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                        <Text style={scoreStyle}>{home === -1 ? 0 : home}</Text>
                        <Text style={scoreStyle}>{away === -1 ? 0 : away}</Text>
                    </View>
                )
            }
            elements.push(
                <View key={"score" + liveData.eventId}
                      style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                    <Text style={[scoreStyle, {color: "#00ADC9"}]}>{score.home}</Text>
                    <Text style={[scoreStyle, {color: "#00ADC9"}]}>{score.away}</Text>
                </View>
            )

            return elements;
        } else if (score) {
            return (
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Text style={scoreStyle}>{score.home}</Text>
                    <Text style={scoreStyle}>{score.away}</Text>
                </View>
            )
        }

        return null;
    }

}

const styles = StyleSheet.create({
    scoreText: {
        fontSize: 20
    },
    scoreTextHeader: {
        fontSize: 18,
        color: "white",
        paddingHorizontal: 2,
        backgroundColor: "black",
        marginVertical: 1,
        borderRadius: 2
    } as TextStyle,
    teamText: {
        fontSize: 18,
        flex: 1,
        marginLeft: 8
    } as TextStyle,
    teamTextHeader: {
        fontSize: 18,
        flex: 1,
        marginLeft: 8
    } as TextStyle,
    teamRow: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle

})


const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    event: state.entityStore.events.get(inputProps.eventId),
    liveData: state.statsStore.liveData.get(inputProps.eventId)
})

export const LiveCardScore: ComponentClass<ExternalProps> =
    connect<StateProps, {}, ExternalProps>(mapStateToProps)(LiveCardScoreComponent)

