import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator, Animated, ListRenderItemInfo, RefreshControl, SectionList, SectionListData, Text, TextStyle,
    View,
    ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
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
import {is, Set} from "immutable";
import {ScrollProps} from "screens/CollapsableScreen3";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }, {}>
    sport: string,
    region: string,
    league: string,
    scrollProps: ScrollProps
}

interface ComponentState {
    sections: SportSection[]
    expanded: Set<string>,
    hasInitExpanded: boolean
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => void
}

interface StateProps {
    loading: boolean,
    events: EventEntity[]
}

type GroupBy = (event: EventEntity, sections: SportSection[]) => SportSection
type SortBy = (a: SportSection, b: SportSection) => number

type ComponentProps = StateProps & DispatchProps & ExternalProps

const AnimatedSectionList: SectionList<EventEntity> = Animated.createAnimatedComponent(SectionList);

interface SportSection extends SectionListData<EventEntity> {
    date: Date,
    events: EventEntity[]
    key: string,
    live: boolean,
    league: string
    count: number
}

class SportScreenComponent extends React.Component<ComponentProps, ComponentState> {
    private todayStr: string
    private toMorrowStr: string


    constructor(props: ComponentProps) {
        super(props);
        const today = new Date()
        const tomorrow = new Date()
        this.todayStr = today.toDateString()
        tomorrow.setDate(today.getDate() + 1)
        this.toMorrowStr = tomorrow.toDateString()

        this.state = {
            sections: [],
            expanded: Set(),
            hasInitExpanded: false
        }
    }


    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.region !== this.props.region) return true
        if (nextProps.sport !== this.props.sport) return true
        if (nextProps.league !== this.props.league) return true
        if (nextProps.events.length !== this.props.events.length) return true
        if (nextProps.events.map(e => e.id).join() !== this.props.events.map(e => e.id).join()) return true
        if (!is(nextState.expanded, this.state.expanded)) return true
        return false
    }

    componentDidMount(): void {
        this.props.loadData(true)
    }

    componentWillReceiveProps(nextProps: Readonly<ComponentProps>, nextContext: any): void {
        if (nextProps.region !== this.props.region ||
            nextProps.sport !== this.props.sport ||
            nextProps.league !== this.props.league) {
            nextProps.loadData(true)
        }
        if (!nextProps.loading) {
            this.prepareData(nextProps.events)
        }
    }

    public render() {
        const {loading} = this.props;
        if (loading) {

            return (
                <View>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        const {sections, expanded} = this.state

        const sectionsView = sections.map(section => ({
            ...section,
            data: expanded.has(section.key) ? section.events : []
        }));


        return (
            <AnimatedSectionList
                {...this.props.scrollProps}
                stickySectionHeadersEnabled={true}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh}/>}
                sections={sectionsView}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    private prepareData(events: EventEntity[]) {
        // const sections = this.groupEvents(events, this.groupByDate);
        const groupByLeague = this.props.league === "all"
        const sections = this.groupEvents(events,
            groupByLeague ? this.groupByLeague : this.groupByDate,
            groupByLeague ? this.sortByLeague : this.sortByDate
        );

        this.setState(prevState => ({
            sections,
            expanded: prevState.hasInitExpanded && sections.length > 0 ? prevState.expanded : Set(sections.length > 0 ? [sections[0].key] : []),
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    private groupEvents(events: EventEntity[], groupBy: GroupBy, sortBy: SortBy): SportSection[] {
        const sections: SportSection[] = []

        for (let event of events) {
            const section = groupBy(event, sections)

            section.events.push(event)
            section.count++
        }

        return sections.sort(sortBy)
    }

    private groupByDate(event: EventEntity, sections: SportSection[]): SportSection {

        const date = new Date(event.start)
        const isEventLive = event.state === "STARTED"

        for (let sec of sections) {
            if (sec.live && isEventLive === true) {
                return sec
            } else if (!sec.live && !isEventLive) {
                if (sec.date.getDate() === date.getDate()) {
                    return sec
                }
            }
        }

        const section: SportSection = {
            live: isEventLive,
            key: isEventLive ? "live" : date.toDateString(),
            date: date,
            league: "",
            data: [],
            events: [],
            count: 0
        }
        sections.push(section)


        return section
    }

    private groupByLeague(event: EventEntity, sections: SportSection[]): SportSection {

        const date = new Date(event.start)
        const isEventLive = event.state === "STARTED"

        let league;

        if (event.path.length === 3) {
            league = event.path[1].name + " / " + event.path[2].name
        } else if (event.path.length === 2) {
            league = event.path[1].name
        } else {
            league = event.group
        }

        for (let sec of sections) {
            if (sec.live && isEventLive === true) {
                return sec
            } else if (!sec.live && !isEventLive) {
                if (sec.league === league) {
                    return sec
                }
            }
        }

        const section: SportSection = {
            live: isEventLive,
            key: isEventLive ? "live" : league,
            date: date,
            league: league,
            data: [],
            events: [],
            count: 0
        }
        sections.push(section)


        return section
    }

    private sortByDate(a: SportSection, b: SportSection): number {
        if (a.live) return -1;
        if (b.live) return 1;

        return Number(a.date) - Number(b.date)
    }

    private sortByLeague(a: SportSection, b: SportSection): number {
        if (a.live) return -1;
        if (b.live) return 1;

        return a.league.localeCompare(b.league)
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
    private renderSectionHeader(info: { section: SportSection }) {
        const section = info.section
        const date = section.date;
        const dateStr = date.toDateString()

        let datum = ""
        if (info.section.live) {
            datum = "LIVE"
        } else if (section.league) {
            datum = section.league
        } else if (dateStr === this.todayStr) {
            datum = "Today"
        } else if (dateStr === this.toMorrowStr) {
            datum = "Tomorrow"
        } else {
            datum = dateStr
        }

        return (
            <Touchable onPress={() => this.toggleSection(section.key)}>
                <View style={headerStyle}>
                    <Text style={section.live ? liveTextStyle : sportTextStyle}>{datum}</Text>
                    <Text style={countTextStyle}>{section.count}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
    private toggleSection(key: string) {
        this.setState(prevState => {
                let expanded: Set<string> = prevState.expanded
                expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                return {
                    expanded
                }
            }
        )
    }

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
    fontWeight: "bold",
    marginLeft: 8,
    flex: 1
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

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(SportScreenComponent)

export const SportView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

