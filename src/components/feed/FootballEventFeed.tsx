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
import {Occurence} from "api/typings";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadLiveData} from "store/stats/actions";
import {AppStore} from "store/store";
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/hoc/AppStateRefresh";
import {default as Svg, G, Path, Polygon, Rect} from "react-native-svg";
import {formatDateTime} from "lib/dates";

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
    occurences?: Occurence[]
    event?: EventEntity
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

class FootballEventFeedComponent extends React.Component<ComponentProps, ComponentState> {
    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (!this.occerencesEquals(nextProps.occurences, this.props.occurences)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        // console.log("render event feed")
        const {loading, style, occurences} = this.props;
        if (loading) {
            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const clone: Occurence[] = occurences ? [...occurences] : []

        clone.unshift({
            occurrenceTypeId: "KICK_OFF",
            eventId: this.props.eventId,
            id: -1,
            periodIndex: 0,
            action: "ADD",
            secondInMatch: -1,
            secondInPeriod: -1,
            periodId: ""
        })

        return this.renderBody(clone)
    }

    private renderBody(occurences: Occurence[]) {
        const data: Occurence[] = occurences.reverse() // .sort((o1, o2) => o2.secondInMatch - o1.secondInMatch)

        return <FlatList
            data={data}
            style={this.props.style}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
        />
    }

    private renderItem = (info: ListRenderItemInfo<Occurence>) => {
        const occurence = info.item

        if (occurence.occurrenceTypeId.endsWith("HOME")) {
            return (
                <View key={occurence.id} style={styles.row}>
                    <View style={styles.homeCol}>
                        {this.renderOccurenceText(occurence, this.props.event!.homeName, "right")}
                    </View>
                    {this.renderSymbol(occurence)}
                    <View style={styles.awayCol}>
                        {this.renderTime(occurence)}
                    </View>
                </View>
            )
        } else if (occurence.occurrenceTypeId.endsWith("AWAY")) {
            return (
                <View key={occurence.id} style={styles.row}>
                    <View style={styles.homeCol}>
                        {this.renderTime(occurence)}
                    </View>
                    {this.renderSymbol(occurence)}
                    <View style={styles.awayCol}>
                        {this.renderOccurenceText(occurence, this.props.event!.awayName, "left")}
                    </View>
                </View>
            )
        } else if (occurence.occurrenceTypeId === "LIFETIME_START") {
            return (
                <View style={[styles.row, {justifyContent: "center"}]}>
                    {this.renderVissle()}
                </View>
            )
        } else if (occurence.occurrenceTypeId === "LIFETIME_END") {
            let score = this.calculateHalfFullTimeScore(occurence.periodIndex);
            return (
                <View style={[styles.row, {justifyContent: "center", backgroundColor: "white"}]}>
                    <Text>{occurence.periodIndex === 0 ? "Half time" : "Full time"} {score.home} - {score.away}</Text>
                </View>
            )
        } else if (occurence.occurrenceTypeId === "KICK_OFF") {
            let dateTime = formatDateTime(this.props.event!.start);
            return (
                <View style={[styles.row, {justifyContent: "center", backgroundColor: "white", flexDirection: "column"}]}>
                    <Text style={{fontWeight: "bold", fontSize: 16}}>Kick-Off</Text>
                    <Text style={{fontSize: 16}}>{dateTime.date} at {dateTime.time}</Text>
                </View>
            )
        }

        return (
            <View key={occurence.id} style={styles.row}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text>{JSON.stringify(occurence)}</Text>
                </View>
            </View>
        )
    }


    private renderSymbol(occurence: Occurence) {
        const id = occurence.occurrenceTypeId.toLowerCase()
        if (id.startsWith("corners")) {
            return this.renderCornerSymbol()
        } else if (id.startsWith("goals")) {
            return this.renderGoalSymbol()
        } else if (id.startsWith("cards_yellow")) {
            return this.renderCardSymbol("yellow")
        } else if (id.startsWith("cards_red")) {
            return this.renderCardSymbol("red")
        } else if (id.startsWith("penalty")) {
            return this.renderUnknown()
        } else if (id.startsWith("lifetime_start")) {
            return this.renderVissle()
        }

        return null
    }

    private renderOccurenceText(occurence: Occurence, team: string, align: "left" | "right") {
        const id = occurence.occurrenceTypeId.toLowerCase()
        let text = ""
        if (id.startsWith("corners")) {
            text = "Corner"
        } else if (id.startsWith("goals")) {
            const score = this.calculateScore(occurence.id);
            text = `${score.home} - ${score.away}`
        } else if (id.startsWith("cards_yellow")) {
            text = "Yellow Card"
        } else if (id.startsWith("cards_red")) {
            text = "Red Card"
        } else if (id.startsWith("penalty_awarded")) {
            text = "Penalty Awarded"
        } else if (id.startsWith("penalty_missed")) {
            text = "Penalty Missed"
        }

        return (
            <View style={{flexDirection: "column"}}>
                <Text style={{textAlign: align, fontWeight: "bold"}}>{text}</Text>
                <Text style={{textAlign: align}}>{team}</Text>
            </View>
        )
    }

    private renderTime(occurence: Occurence) {
        let minutes = Math.round(occurence.secondInMatch / 60);
        let overTime = 0
        if (occurence.periodIndex == 0 && minutes > 45) {
            overTime = minutes - minutes
            minutes = 45
        } else if (occurence.periodIndex == 1 && minutes > 90) {
            overTime = minutes - minutes
            minutes = 90
        }

        if (overTime > 0) {
            return (
                <View style={[styles.timeBox, {width: 55}]}>
                    <Text>{minutes}' +{overTime}</Text>
                </View>
            )
        }

        return (
            <View style={styles.timeBox}>
                <Text>{minutes}'</Text>
            </View>
        )
    }

    private renderGoalSymbol() {
        return (
            <Svg width="40" height="40" viewBox="0 0 30 30" style={styles.symbol}>
                <Path d="M30,15A15,15,0,1,1,15,0,15,15,0,0,1,30,15" fill="#98d5f4" fillRule="evenodd"/>
                <Path
                    d="M15.52,8.36s-10,1.85-13.83,13.59A16,16,0,0,0,6.42,27.3a13.14,13.14,0,0,1,10.69-6.55C15.71,16,15.52,8.36,15.52,8.36Z"
                    fill="#fff" fillOpacity="0.27"/>
                <Path
                    d="M12.52,12S6,14.3,2.53,23.36a17.83,17.83,0,0,0,1.88,2.23,16.58,16.58,0,0,1,11.7-5.84A27.93,27.93,0,0,0,12.52,12Z"
                    fill="#fff" fillOpacity="0.27"/>
                <Path
                    d="M17.81,9.85l-2.05-1.1a0.45,0.45,0,0,1-.24-0.39,6.25,6.25,0,0,0-3.31,1.85,0.92,0.92,0,0,1,.18.3l0.53,1.56a0.93,0.93,0,0,1-.33,1l-1.32,1a0.92,0.92,0,0,1-.75.15c0,0.08,0,.17,0,0.25a6.25,6.25,0,0,0,2.38,4.91l0.25-.79a0.67,0.67,0,0,1,.63-0.47l2,0a0.67,0.67,0,0,1,.65.46l0.65,1.91a0.66,0.66,0,0,1,0,.25A6.23,6.23,0,0,0,21,19.1l-0.28-1.73A0.52,0.52,0,0,1,21,16.81l1.86-1A6.24,6.24,0,0,0,19.37,8.8l-1,1A0.46,0.46,0,0,1,17.81,9.85Zm1,2,1.62,1.18a0.69,0.69,0,0,1,.25.77l-0.62,1.9a0.69,0.69,0,0,1-.65.47h-2a0.69,0.69,0,0,1-.65-0.47l-0.62-1.9a0.69,0.69,0,0,1,.25-0.77L18,11.88A0.69,0.69,0,0,1,18.85,11.88Z"
                    fill="#fff"/>
                <Path
                    d="M16.42,13.06a0.69,0.69,0,0,0-.25.77l0.62,1.9a0.69,0.69,0,0,0,.65.47h2a0.69,0.69,0,0,0,.65-0.47l0.62-1.9a0.69,0.69,0,0,0-.25-0.77l-1.62-1.18a0.69,0.69,0,0,0-.81,0Z"
                    fill="#252525"/>
                <Path d="M20.75,17.36L21,19.1a6.25,6.25,0,0,0,1.86-3.23l-1.86,1A0.52,0.52,0,0,0,20.75,17.36Z"
                      fill="#252525"/>
                <Path
                    d="M17.08,20.5l-0.65-1.91a0.67,0.67,0,0,0-.65-0.46l-2,0a0.67,0.67,0,0,0-.63.47l-0.25.79a6.24,6.24,0,0,0,3.89,1.36l0.33,0A0.66,0.66,0,0,0,17.08,20.5Z"
                    fill="#252525"/>
                <Path
                    d="M15.52,8.36a0.45,0.45,0,0,0,.24.39l2.05,1.1a0.46,0.46,0,0,0,.53-0.07l1-1A6.24,6.24,0,0,0,15.52,8.36Z"
                    fill="#252525"/>
                <Path
                    d="M11.28,14.1l1.32-1a0.93,0.93,0,0,0,.33-1L12.4,10.51a0.92,0.92,0,0,0-.18-0.3,6.24,6.24,0,0,0-1.69,4A0.92,0.92,0,0,0,11.28,14.1Z"
                    fill="#252525"/>
                <G fillOpacity="0.09">
                    <Path d="M20.7,9.67a6.26,6.26,0,0,1-8.81,8.81A6.26,6.26,0,1,0,20.7,9.67Z"
                          fill="#737373"/>
                </G>
                <G fillOpacity="0.09">
                    <Path d="M12.85,19.38a6.26,6.26,0,0,1,8.81-8.81A6.26,6.26,0,1,0,12.85,19.38Z"
                          fill="#fcfcfc"/>
                </G>
            </Svg>
        )
    }

    private renderCardSymbol(card: "red" | "yellow") {
        const color = card === "red" ? "#d20d0c" : "#f7ce00"
        return (
            <Svg width="40" height="40" viewBox="0 0 30 30" style={styles.symbol}>
                <Path d="M30,15A15,15,0,1,1,15,0,15,15,0,0,1,30,15" fill="#98d5f4" fillRule="evenodd"/>
                <Path
                    d="M20.67,24H9.33A1.27,1.27,0,0,1,8,22.82V7.18A1.27,1.27,0,0,1,9.33,6H20.67A1.27,1.27,0,0,1,22,7.18V22.82A1.27,1.27,0,0,1,20.67,24"
                    fill={color}
                    fillRule="evenodd"/>
            </Svg>
        )
    }

    private renderUnknown() {
        return (
            <Svg width="40" height="40" viewBox="0 0 30 30" style={styles.symbol}>
                <Path d="M30,15A15,15,0,1,1,15,0,15,15,0,0,1,30,15" fill="#98d5f4" fillRule="evenodd"/>
            </Svg>
        )
    }

    private renderCornerSymbol() {
        return (
            <Svg width="40" height="40" viewBox="0 0 30 30" style={styles.symbol}>
                <Path d="M30,15A15,15,0,1,1,15,0,15,15,0,0,1,30,15" fill="#98d5f4" fillRule="evenodd"/>
                <Rect x="7" y="9" width="16" height="12" fill="#ff0"/>
                <Rect x="7" y="15" width="8" height="6" fill="#ff7c18"/>
                <Rect x="15" y="9" width="8" height="6" fill="#ff7c18"/>
                <Path
                    d="M7,7.38A0.45,0.45,0,0,0,6.5,7a0.45,0.45,0,0,0-.5.38V27c0.32,0.24.65,0.47,1,.69a0.29,0.29,0,0,0,0,0V7.38Z"
                    fill="#fff"/>
            </Svg>
        )
    }

    private renderVissle() {
        return (
            <Svg width="40" height="40" viewBox="0 0 40 40" style={styles.symbol}>
                <G fill="#98D5F4">
                    <G>
                        <Path
                            d="M40,20 C40,31.045738 31.045738,40 20,40 C8.95426201,40 0,31.045738 0,20 C0,8.95426201 8.95426201,0 20,0 C31.045738,0 40,8.95426201 40,20"
                            id="Fill-1"/>
                    </G>
                    <G transform="translate(8.000000, 8.000000)">
                        <Path
                            d="M7.53159862,0.591436351 L14.4270233,4.31474235 L17.6206781,6.03903219 L20.1146029,7.38570214 C23.5960485,9.26564251 24.9992233,13.7987549 23.242371,17.5241163 C22.5322789,19.0302026 21.4153306,20.1705937 20.1067825,20.8712303 C18.1786635,21.9034611 11.9062945,24.8713339 9.83232505,23.7514451 C6.35087954,21.871714 8.88333891,14.431399 10.6399957,10.7060375 C10.8192692,10.3259439 11.0228096,9.97269094 11.2485804,9.64440129 L0,4.72682227 L0,2.73481863 L6.60838524,0 C6.60838524,0 6.96622227,0.225052243 7.53159862,0.591436351 Z"
                            fill="#D8D8D8"/>
                        <G transform="translate(0.000000, 3.130435)">
                            <Polygon fill="#252525"
                                     points="14.8723081 2.60869565 18.1499179 4.19911998 14.3845324 5.53468153 10.7329193 3.76273043"/>
                            <Path
                                d="M0,3.91666672 L0,0 L8.3791405,4.06571611 L11.8017421,5.72625289 L14.4744513,7.02313171 C18.2054747,8.83356407 19.7092403,13.1990713 17.8264428,16.7866931 C17.0654456,18.237094 15.8684255,19.3353209 14.4660703,20.0100525 C12.3997283,21.004118 9.88730617,21.0780585 7.66465801,19.9995759 C3.93363466,18.189345 2.43804053,13.8083243 4.32062855,10.2207026 C5.01792993,8.89219258 6.05780576,7.90417118 7.33591226,7.17020668 L0,3.91666672 Z"
                                id="Fill-8" fill="#EBEBEB"/>
                        </G>
                    </G>
                </G>
            </Svg>
        )
    }

    private keyExtractor = (item: Occurence) => {
        return item.id.toString()
    }

    private occerencesEquals(o1?: Occurence[], o2?: Occurence[]): boolean {
        if (o1 && o2) {
            if (o1.length !== o2.length) return false;
        } else if (!o1 && o2) {
            return false
        } else if (o1 && !o2) {
            return false
        }

        return true
    }

    private calculateScore = (occurenceId: number): { home: number, away: number } => {
        const occurences = this.props.occurences!.sort((o1, o2) => o1.secondInMatch - o2.secondInMatch);
        let home = 0, away = 0

        for (let o of occurences) {
            if (o.occurrenceTypeId.toLowerCase() === "goals_home") home++
            if (o.occurrenceTypeId.toLowerCase() === "goals_away") away++
            if (o.id === occurenceId) break;
        }

        return {home, away}
    }

    private calculateHalfFullTimeScore = (periodIndex: number): { home: number, away: number } => {
        const occurences = this.props.occurences!;
        let home = 0, away = 0

        for (let o of occurences.filter(o => o.periodIndex <= periodIndex)) {
            if (o.occurrenceTypeId.toLowerCase() === "goals_home") home++
            if (o.occurrenceTypeId.toLowerCase() === "goals_away") away++
        }

        return {home, away}
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
    occurences: state.statsStore.occurences.get(inputProps.eventId),
    event: state.entityStore.events.get(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLiveData(inputProps.eventId, fireStartLoad))
    },
})

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(FootballEventFeedComponent))

export const FootballEventFeed: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(WithAppStateRefresh))

