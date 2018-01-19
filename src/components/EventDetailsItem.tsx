import * as React from "react"
import {StyleSheet, Text, TextStyle, View, ViewStyle} from "react-native";
import FavoriteItem from "components/FavoriteItem";
import {EventEntity} from "model/EventEntity";
import EventPathItem from "components/EventPathItem";
import {LiveData} from "api/typings";
import {renderServe} from "components/RenderUtils";
import {Theme} from "lib/device";

interface Props {
    style: ViewStyle
    event: EventEntity
    liveData: LiveData
    theme: Theme
    showFavorites?: boolean
}

export default class EventDetailsItem extends React.Component<Props> {

    public render() {
        const {event, style, liveData, theme} = this.props;
        const viewStyle: ViewStyle = {
            ...style,
            flexDirection: "column"
        }
        const homeServe = renderServe(liveData, true);
        let awayServe = renderServe(liveData, false);
         
        return (
            <View style={viewStyle}>
                <View style={{flexDirection: "row"}}>
                    <View style={{flexDirection: "column", flex: 1}}>
                        <View style={styles.participant}>
                            {homeServe}
                            <Text numberOfLines={1}
                                  ellipsizeMode={"tail"}
                                  style={[styles.participantText, {paddingLeft: homeServe ? 0 : 16}]}>{event.homeName}</Text>
                        </View>
                        <View style={styles.participant}>
                            {awayServe}
                            <Text numberOfLines={1}
                                  ellipsizeMode={"tail"}
                                  style={[styles.participantText, {paddingLeft: awayServe ? 0 : 16}]}>{event.awayName}</Text>
                        </View>
                        <View style={{flexDirection: "row", paddingLeft: 16, marginTop: 2}}>
                            {this.renderLiveText(event)}
                            <EventPathItem path={event.path} theme={theme}/>
                        </View>
                    </View>
                    {this.props.showFavorites && <View style={{justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
                        <FavoriteItem eventId={event.id} style={{justifyContent: "center"}}/>
                        {/*<Text style={styles.betOfferCount}>+{event.liveBoCount || event.nonLiveBoCount}</Text>*/}
                    </View>}
                </View>
            </View>
        )
    }

    private renderLiveText(event: EventEntity) {
        if (!event.openForLiveBetting && event.liveBetOffers) {
            return <Text style={styles.liveText}>Live</Text>
        }
    }
}

const styles = StyleSheet.create({
    participant: {
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    participantText: {
        color: "#202020",
        fontSize: 16,
        fontWeight: "400",
        paddingLeft: 0
    } as TextStyle,
    betOfferCount: {
        minWidth: 48,
        fontSize: 12,
        padding: 8,
        color: "#717171",
        textAlign: "right"
    } as TextStyle,
    liveText: {
        color: "red",
        fontSize: 12,
        fontStyle: "italic",
        marginRight: 4
    } as TextStyle,

})

