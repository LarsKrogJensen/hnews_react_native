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
}

interface StateProps {
    event: EventEntity,
    liveData: LiveData
}

type Props = StateProps & ExternalProps

export class LiveCardScoreComponent extends React.Component<Props> {

    public render() {
        const {event, liveData} = this.props;

        return (
            <View style={{flexDirection: "row", marginRight: 8}}>
                <View style={{flexDirection: "column", flex: 1}}>
                    <View style={styles.teamRow}>
                        {renderTeamColors(event.teamColors && event.teamColors.home)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.teamText, styles.defaultText]}>{event.homeName}</Text>
                        {renderServe(liveData, true)}
                    </View>
                    <View style={[styles.teamRow, {marginBottom: 8}]}>
                        {renderTeamColors(event.teamColors && event.teamColors.away)}
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.teamText, styles.defaultText]}>{event.awayName}</Text>
                        {renderServe(liveData, false)}
                    </View>
                </View>
                {this.renderScoreColumns(liveData)}
            </View>
        )
    }

    private renderScoreColumns(liveData: LiveData) {
        const {statistics: stats, score} = liveData

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
                        <Text style={styles.defaultText}>{home === -1 ? 0 : home}</Text>
                        <Text style={{fontSize: 20}}>{away === -1 ? 0 : away}</Text>
                    </View>
                )
            }
            elements.push(
                <View key={"score" + liveData.eventId}
                      style={{flexDirection: "column", alignItems: "center", marginLeft: 8}}>
                    <Text style={[styles.defaultText, {color: "#00ADC9"}]}>{score.home}</Text>
                    <Text style={[styles.defaultText, {color: "#00ADC9"}]}>{score.away}</Text>
                </View>
            )

            return elements;
        } else if (score) {
            return (
                <View style={{flexDirection: "column", alignItems: "center"}}>
                    <Text style={styles.defaultText}>{score.home}</Text>
                    <Text style={styles.defaultText}>{score.away}</Text>
                </View>
            )
        }

        return null;
    }

}

const styles = StyleSheet.create({
    defaultText: {
        fontSize: 20,
    } as TextStyle,
    teamText: {
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

