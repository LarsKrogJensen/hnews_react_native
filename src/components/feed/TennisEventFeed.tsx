import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import {LiveFeedEvent} from "api/typings";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadLiveData} from "store/stats/actions";
import {AppStore} from "store/store";
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import autobind from "autobind-decorator";

interface ExternalProps {
    eventId: number
    eventGroupId: number
    style?: ViewStyle
}

interface ComponentState {
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    liveFeed?: LiveFeedEvent[]
    event?: EventEntity
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

type LiveFeedEventWithId = LiveFeedEvent & { id: number }

class TennisEventFeedComponent extends React.Component<ComponentProps, ComponentState> {
    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (!this.feedEventsEquals(nextProps.liveFeed, this.props.liveFeed)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        console.log("render event feed")
        const {loading, style, liveFeed} = this.props;
        if (loading) {
            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const clone: LiveFeedEventWithId[] = liveFeed ? liveFeed.map((value, index) => ({...value, id: index})): []

        clone.unshift({
            type: "TICKER",
            ticker: {
                eventId: this.props.eventId,
                id: -1,
                message: "Starts",
                minute: -1,
                type: "KICK-OFF"
            },
            id: Number.MAX_VALUE
        })

        return this.renderBody(clone.reverse())
    }

    private renderBody(liveFeed: LiveFeedEventWithId[]) {
        return <FlatList
            data={liveFeed}
            style={this.props.style}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
        />
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<LiveFeedEventWithId>) {
        const feedEvent = info.item

        // if (feedEvent.occurrenceTypeId.endsWith("HOME")) {
        //     return (
        //         <View key={feedEvent.id} style={styles.row}>
        //             <View style={styles.homeCol}>
        //                 {this.renderOccurenceText(feedEvent, this.props.event!.homeName, "right")}
        //             </View>
        //             {this.renderSymbol(feedEvent)}
        //             <View style={styles.awayCol}>
        //                 {this.renderTime(feedEvent)}
        //             </View>
        //         </View>
        //     )
        // } else if (feedEvent.occurrenceTypeId.endsWith("AWAY")) {
        //     return (
        //         <View key={feedEvent.id} style={styles.row}>
        //             <View style={styles.homeCol}>
        //                 {this.renderTime(feedEvent)}
        //             </View>
        //             {this.renderSymbol(feedEvent)}
        //             <View style={styles.awayCol}>
        //                 {this.renderOccurenceText(feedEvent, this.props.event!.awayName, "left")}
        //             </View>
        //         </View>
        //     )
        // } else if (feedEvent.occurrenceTypeId === "LIFETIME_START") {
        //     return (
        //         <View style={[styles.row, {justifyContent: "center"}]}>
        //             {this.renderVissle()}
        //         </View>
        //     )
        // } else if (feedEvent.occurrenceTypeId === "LIFETIME_END") {
        //     let score = this.calculateHalfFullTimeScore(feedEvent.periodIndex);
        //     return (
        //         <View style={[styles.row, {justifyContent: "center", backgroundColor: "white"}]}>
        //             <Text>{feedEvent.periodIndex === 0 ? "Half time" : "Full time"} {score.home} - {score.away}</Text>
        //         </View>
        //     )
        // } else if (feedEvent.occurrenceTypeId === "KICK_OFF") {
        //     let dateTime = formatDateTime(this.props.event!.start);
        //     return (
        //         <View style={[styles.row, {justifyContent: "center", backgroundColor: "white", flexDirection: "column"}]}>
        //             <Text style={{fontWeight: "bold", fontSize: 16}}>Kick-Off</Text>
        //             <Text style={{fontSize: 16}}>{dateTime.date} at {dateTime.time}</Text>
        //         </View>
        //     )
        // }

        return (
            <View style={styles.row}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text>{JSON.stringify(feedEvent)}</Text>
                </View>
            </View>
        )
    }


    @autobind
    private keyExtractor(item: LiveFeedEventWithId) {
        return item.id.toString()
    }

    private feedEventsEquals(f1?: LiveFeedEvent[], f2?: LiveFeedEvent[]): boolean {
        if (f1 && f2) {
            if (f1.length !== f2.length) return false;
        } else if (!f1 && f2) {
            return false
        } else if (f1 && !f2) {
            return false
        }

        return true
    }


}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 8
    } as TextStyle,
    timeBox: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#cecece",
        backgroundColor: "white"
    } as ViewStyle,
    timeText: {} as TextStyle,
    symbol: {
        marginHorizontal: 16,
        marginVertical: 8
    } as ViewStyle,
    homeCol: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    } as ViewStyle,
    awayCol: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start"
    } as ViewStyle,
    row: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: "#F6F6F6",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#D1D1D1"
    },
    resultBox: {
        width: 50,
        height: 40,
        marginRight: 4,
        backgroundColor: "black",
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    result: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    } as TextStyle,
    team: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 16
    } as TextStyle
})

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.liveDataLoading.has(inputProps.eventId),
    liveFeed: state.statsStore.liveFeed.get(inputProps.eventId),
    event: state.entityStore.events.get(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLiveData(inputProps.eventId, fireStartLoad))
    },
})

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(TennisEventFeedComponent))

export const TennisEventFeed: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(WithAppStateRefresh))

