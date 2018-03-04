import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    Animated,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {EventEntity} from "entity/EventEntity";
import {loadSport} from "store/sport/actions";
import connectAppState from "components/hoc/AppStateRefresh";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import Touchable from "components/Touchable";
import {EventListItem} from "components/event/EventListItem";
import {is, Set} from "immutable";
import {NAVBAR_HEIGHT, ScrollHooks} from "screens/CollapsableHeaderScreen";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {formatDateTime} from "lib/dates";
import {arrayEquals} from "lib/equallity";


interface ExternalProps {
    navigation: NavigationScreenProp<{ params: any }>
    sport: string,
    region: string,
    league: string,
    participant: string,
    scrollHooks?: ScrollHooks,
    filter: "matches" | "competitions"
}

interface ComponentState {
    sections: SportSection[]
    expanded: Set<string>
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

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

const AnimatedSectionList: SectionList<EventEntity> = Animated.createAnimatedComponent(SectionList);

interface SportSection extends SectionListData<EventEntity> {
    date: Date,
    events: EventEntity[]
    key: string
    live: boolean,
    league: string
    count: number
}

class SportViewComponent extends React.Component<ComponentProps, ComponentState> {
    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            sections: [],
            expanded: Set(),
            hasInitExpanded: false
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.filter !== this.props.filter) return true
        if (nextProps.region !== this.props.region) return true
        if (nextProps.sport !== this.props.sport) return true
        if (nextProps.league !== this.props.league) return true
        if (nextProps.participant !== this.props.participant) return true
        if (!arrayEquals(nextProps.events, this.props.events, e => e.id)) {
            console.log("Sportsview event diff: " + nextProps.events.length + " old " + this.props.events.length)
            // console.log(JSON.stringify(nextProps.events.map()))
            return true
        }
        if (!is(nextState.expanded, this.state.expanded)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData(true)
        if (this.props.events.length) {
            this.prepareData(this.props.events)
        }
    }

    componentWillReceiveProps(nextProps: Readonly<ComponentProps>, nextContext: any): void {
        if (nextProps.region !== this.props.region ||
            nextProps.sport !== this.props.sport ||
            nextProps.league !== this.props.league ||
            nextProps.participant !== this.props.participant ||
            nextProps.filter !== this.props.filter) {
            nextProps.loadData(true)
        }
        if (!nextProps.loading &&
            (nextProps.league !== this.props.league || !arrayEquals(nextProps.events, this.props.events, e => e.id))
        ) {
            this.prepareData(nextProps.events)
        }
    }

    public render() {
        console.log("Render SportView")

        const {loading} = this.props;
        const {sections, expanded} = this.state

        if (loading && !sections.length) {
            return (
                <View>
                    <ActivityIndicator style={{marginTop: NAVBAR_HEIGHT + 8}}/>
                </View>
            )
        }

        const sectionsView = sections.map(section => ({
            ...section,
            data: expanded.has(section.key) ? section.events : []
        }));


        return (
            <AnimatedSectionList
                {...this.props.scrollHooks}
                ListEmptyComponent={<Text> Empty </Text>}
                stickySectionHeadersEnabled={true}
                sections={sectionsView}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                // getItemLayout={this.getItemLayout}
                renderItem={this.renderItem}
            />
        )
    }

    private getItemLayout = (data, index) => (
        {length: 80, offset: 80 * index, index}
    )

    private prepareData = (events: EventEntity[]) => {
        const groupByLeague = this.props.league === "all"
        const sections = this.groupEvents(events,
            groupByLeague ? this.groupByLeague : this.groupByDate,
            groupByLeague ? this.sortByLeague : this.sortByDate
        );

        let {expanded, hasInitExpanded} = this.state

        if (!hasInitExpanded && sections.length) {
            // make sure we fill screen with exapnded sections (at least 5 events)
            let count = 0;
            expanded = Set()
            for (let section of sections) {
                count += section.count
                expanded = expanded.add(section.key)
                if (count > 5) {
                    break
                }
            }
        }

        this.setState(prevState => ({
            sections,
            expanded,
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    private groupEvents = (events: EventEntity[], groupBy: GroupBy, sortBy: SortBy): SportSection[] => {
        const sections: SportSection[] = []

        for (let event of events) {
            const section = groupBy(event, sections)

            section.events.push(event)
            section.count++
        }

        return sections.sort(sortBy)
    }

    private groupByDate = (event: EventEntity, sections: SportSection[]): SportSection => {

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

    private groupByLeague = (event: EventEntity, sections: SportSection[]): SportSection => {

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

    private sortByDate = (a: SportSection, b: SportSection): number => {
        if (a.live) return -1;
        if (b.live) return 1;

        return Number(a.date) - Number(b.date)
    }

    private sortByLeague = (a: SportSection, b: SportSection): number => {
        if (a.live) return -1;
        if (b.live) return 1;

        return a.league.localeCompare(b.league)
    }

    private renderItem = (info: ListRenderItemInfo<EventEntity>) => {
        const {navigation, orientation} = this.props
        const event: EventEntity = info.item
        console.log("Render ListItem")
        return <EventListItem eventId={event.id}
                                  navigation={navigation}
                                  orientation={orientation}/>
    }

    private renderSectionHeader = (info: { section: SportSection }) => {
        const section = info.section
        console.log("Render Header: ") // + section.key)
        return <SectionHeader key={section.key} section={section} toggleSection={this.toggleSection}/>
    }

    private toggleSection = (key: string) => {
        requestAnimationFrame(() => {
            this.setState(prevState => {
                    let expanded: Set<string> = prevState.expanded
                    expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                    return {
                        expanded
                    }
                }
            )
        })
    }

    private keyExtractor = (event: EventEntity): string => {
        return event.id.toString()
    }
}

class SectionHeader extends React.Component<{ section: SportSection, toggleSection: (key: string) => void }> {


    shouldComponentUpdate(nextProps: Readonly<{ section: SportSection; toggleSection: (key: string) => void }>, nextState: Readonly<{}>, nextContext: any): boolean {
        return nextProps.section.key !== this.props.section.key
    }

    public render() {
        const {section, toggleSection} = this.props
        // console.log("Section Render Header")

        let title = ""
        if (section.live) {
            title = "LIVE"
        } else if (section.league) {
            title = section.league
        } else {
            title = formatDateTime(section.date.toISOString()).date
        }

        return (
            <Touchable onPress={() => toggleSection(section.key)}>
                <View style={styles.header}>
                    <Text style={section.live ? styles.liveText : styles.sectionTitleText}>{title}</Text>
                    <Text style={styles.countText}>{section.count}</Text>
                </View>
            </Touchable>
        )
    }
}

// styles
const styles = StyleSheet.create({
    header: {
        padding: 8,
        height: 44,
        backgroundColor: "white",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    liveText: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        flex: 1,
    } as TextStyle,
    sectionTitleText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        flex: 1
    } as TextStyle,
    countText: {
        fontSize: 16,
        fontWeight: "bold",
        marginRight: 8
    }
})


// Redux connect
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

//
// const getEventIds = (state: AppStore, props: ExternalProps): number[] => {
//     let {sport, region, league, filter} = props
//
//     const key = `${sport}.${region}.${league}.${filter}`
//
//     return state.sportStore.events.get(key, [])
// }
//
// const getEventStore = (state: AppStore): Map<number, EventEntity> => {
//     return state.entityStore.events
// }
//
// const getEvents = createSelector(
//     [getEventIds, getEventStore],
//     (eventIds: number[], eventStore: Map<number, EventEntity>) => {
//         return eventIds.map(id => eventStore.get(id)).filter(event => event)
//     }
// )

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => {
    let {sport, region, league, participant, filter} = inputProps

    const key = `${sport}.${region}.${league}.${participant}.${filter}`

    return {
        loading: state.sportStore.loading.contains(key),
        events: mapEvents(state, key)
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => {
    let {sport, region, league, participant, filter} = inputProps

    return {
        loadData: (fireStartLoad: boolean) => {
            if (sport && region && league && participant) {
                dispatch(loadSport(sport, region, league, participant, filter, fireStartLoad))
            }
        }
    }
}

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(SportViewComponent))

export const SportView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

