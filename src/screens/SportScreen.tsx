import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    ListRenderItemInfo,
    RefreshControl,
    SectionList,
    SectionListData,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";
import {EventEntity} from "model/EventEntity";
import {loadSport} from "store/sport/actions";
import connectAppState from "components/AppStateRefresh";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadOpenForLive} from "store/live/actions";
import {orientation} from "lib/device";
import autobind from "autobind-decorator";
import Touchable from "components/Touchable";
import LiveEventListItem from "components/EventListItem";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    sport: string,
    region: string,
    league: string
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => void
}

interface StateProps {
    loading: boolean,
    events: EventEntity[]
}

type ComponentProps = StateProps & DispatchProps & ExternalProps

interface DateSection extends SectionListData<EventEntity> {
    date: Date,
    league: string
    count: number
}

class SportScreenComponent extends React.Component<ComponentProps> {
    private todayStr: string
    private toMorrowStr: string


    constructor(props: ComponentProps) {
        super(props);
        const today = new Date()
        const tomorrow = new Date()
        this.todayStr = today.toDateString()
        tomorrow.setDate(today.getDate() + 1)
        this.toMorrowStr = tomorrow.toDateString()

    }

    componentDidMount(): void {
        console.log("Did mount sport with: " + this.props.sport + "/" + this.props.region + "/" + this.props.league)
        this.props.loadData(true)
    }


    componentWillUnmount(): void {
        console.log("Will unmount sport with: " + this.props.sport + "/" + this.props.region + "/" + this.props.league)
    }


    componentWillReceiveProps(nextProps: Readonly<ComponentProps>, nextContext: any): void {
        console.log("New props : " + nextProps.sport + "/" + nextProps.region + "/" + nextProps.league)
    }

    public render() {
        return (
            <Screen title="Sport" {...this.props} rootScreen>
                {this.renderBody()}
            </Screen>
        )
    }

    private renderBody() {
        const {loading, events} = this.props;
        // const {expanded} = this.state

        if (loading) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const sections: DateSection[] = []

        for (let event of events) {
            let date = new Date(event.start)

            let section: DateSection | undefined = undefined
            for (let s of sections) {
                if (s.date.getDate() === date.getDate()) {
                    section = s;
                    break;
                }
            }
            if (!section) {
                section = {
                    date: date,
                    league: "",
                    data: [],
                    count: 0
                }
                sections.push(section)
            }

            // if (expanded.has(date.toISOString())) {
            section.data.push(event)
            // }
            section.count++
        }


        return (
            <SectionList
                stickySectionHeadersEnabled={true}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh}/>}
                sections={sections}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    @autobind
    private onRefresh() {
        this.props.loadData(true)
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<EventEntity>) {
        const {navigation} = this.props
        const event: EventEntity = info.item
        let orient = orientation();
        return <LiveEventListItem eventId={event.id}
                                  navigation={navigation}
                                  orientation={orient}/>
    }

    @autobind
    private renderSectionHeader(info: { section: DateSection }) {
        const date = info.section.date;
        const dateStr = date.toDateString()

        let datum = ""
        if (dateStr === this.todayStr) {
            datum = "Today"
        } else if (dateStr === this.toMorrowStr) {
            datum = "Tomorrow"
        } else {
            datum = dateStr
        }

        return (
            <Touchable>
                <View style={headerStyle}>
                    {/*<Text style={liveTextStyle}>{hour}</Text>*/}
                    <Text style={sportTextStyle}>{datum}</Text>
                    <Text style={countTextStyle}>{info.section.count}</Text>
                </View>
            </Touchable>
        )
    }

    // @autobind
    // private toggleSection(name: string) {
    //     this.setState(prevState => {
    //             let expanded: Set<string> = prevState.expanded
    //             expanded = expanded.has(name) ? expanded.delete(name) : expanded.add(name)
    //             return {
    //                 expanded
    //             }
    //         }
    //     )
    // }

    @autobind
    private padHours(hours: number): string {
        if (hours === 24)
            hours = 0;
        if (hours < 10) return "0" + hours

        return hours.toString()
    }

    private keyExtractor(event: EventEntity): string {
        return event.id.toString()
    }
}

function mapEvents(state: AppStore, key: string): EventEntity[] {
    const events: EventEntity[] = []
    for (let eventId of state.sportStore.events.get(key, [])) {
        let eventEntity = state.entityStore.events.get(eventId);
        if (eventEntity) {
            events.push(eventEntity)
        }
    }

    return events
}

// styles

const headerStyle: ViewStyle = {
    padding: 8,
    height: 44,
    backgroundColor: "white",
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center"
}

const liveTextStyle: TextStyle = {
    color: "red",
    fontSize: 16,
    fontWeight: "bold"
}

const sportTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    flex: 1
}

const countTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8
}


// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    let {sport, region, league} = inputProps
    const params = inputProps.navigation.state.params

    if (!sport && params) {
        sport = params.sport
        region = params.region
        league = params.league
    }

    const key = `${sport}.${region}.${league}`

    return {
        loading: state.sportStore.loading.contains(key),
        events: mapEvents(state, key)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => {
    let {sport, region, league} = inputProps

    const params = inputProps.navigation.state.params

    if (!sport && params) {
        sport = params.sport
        region = params.region
        league = params.league
    }

    return {
        loadData: (fireStartLoad: boolean) => {
            console.log("loading sports " + sport + ", " + region + "," + league + " fireStartLoad: " + fireStartLoad)
            if (sport && region && league) {
                dispatch(loadSport(sport, region, league, fireStartLoad))
                dispatch(loadOpenForLive(fireStartLoad))
            }
        }
    }
}

export const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(SportScreenComponent)

export const SportsScreen: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

