import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    Animated,
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
import LiveEventListItem from "components/event/EventListItem";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as SoonActions from "store/soon/actions"
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/hoc/AppStateRefresh";
import Touchable from "components/Touchable";
import {is, Set} from "immutable"
import {CollapsableHeaderScreen, NAVBAR_HEIGHT, ScrollHooks} from "screens/CollapsableHeaderScreen";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {formatDateTime} from "lib/dates";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => void
}

interface StateProps {
    loading: boolean,
    events: EventEntity[]
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

interface State {
    refreshing: boolean
    expanded: Set<string>
    sections: DateSection[]
    hasInitExpanded: boolean
}

interface DateSection extends SectionListData<EventEntity> {
    date: Date
    key: string
    count: number
    events: EventEntity[]
}


const AnimatedSectionList: SectionList<EventEntity> = Animated.createAnimatedComponent(SectionList);

class StartingSoonScreen extends React.Component<ComponentProps, State> {

    constructor(props: ComponentProps) {
        super(props);

        this.state = {
            refreshing: false,
            expanded: Set(),
            sections: [],
            hasInitExpanded: false
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<State>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (this.hasPropsChanges(nextProps, this.props)) return true
        if (!is(nextState.expanded, this.state.expanded)) return true
        // noinspection RedundantIfStatementJS
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
        if (!nextProps.loading && this.hasPropsChanges(nextProps, this.props)) {
            this.prepareData(nextProps.events)
        }
    }

    public render() {
        return (
            <CollapsableHeaderScreen {...this.props}
                                     title="Starting Soon"
                                     rootScreen
                                     renderBody={this.renderBody}/>
        )
    }

    private renderBody = (scrollHooks: ScrollHooks) => {
        console.log("RENDERING STARTING SOON")
        const {loading} = this.props;
        const {expanded, sections} = this.state

        if (loading) {
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
                {...scrollHooks}
                stickySectionHeadersEnabled={true}
                refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}
                sections={sectionsView}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    private onRefresh = () => {
        this.props.loadData(true)
    }

    private hasPropsChanges = (nextProps: ComponentProps, props: ComponentProps): boolean => {
        return nextProps.events.length !== props.events.length ||
            nextProps.events.map(e => e.id).join() !== props.events.map(e => e.id).join()
    }


    private renderItem = (info: ListRenderItemInfo<EventEntity>) => {
        const {orientation, navigation} = this.props
        const event: EventEntity = info.item;

        return <LiveEventListItem eventId={event.id}
                                  navigation={navigation}
                                  orientation={orientation}/>
    }

    private renderSectionHeader = (info: { section: DateSection }) => {
        const date = info.section.date
        const {date: datum} = formatDateTime(date.toISOString())

        let hour = ""
        const today = new Date()
        if (datum === "Today" && date.getHours() === today.getHours()) {
            hour = "Next up"
        } else {
            hour = `${this.padHours(date.getHours())}:00 - ${this.padHours(date.getHours() + 1)}:00`
        }

        return (
            <Touchable onPress={() => this.toggleSection(info.section.key)}>
                <View style={headerStyle}>
                    <Text style={liveTextStyle}>{hour}</Text>
                    <Text style={sportTextStyle}>{datum}</Text>
                    <Text style={countTextStyle}>{info.section.count}</Text>
                </View>
            </Touchable>
        )
    }

    private prepareData = (events: EventEntity[]) => {
        const sections: DateSection[] = []

        for (let event of events) {
            let date = new Date(event.start);
            date.setMinutes(0)
            date.setSeconds(0)
            date.setMilliseconds(0)

            let section: DateSection | undefined = undefined
            for (let s of sections) {
                if (s.date.getTime() === date.getTime()) {
                    section = s;
                    break;
                }
            }
            if (!section) {
                section = {
                    key: date.toISOString(),
                    date: date,
                    data: [],
                    events: [],
                    count: 0
                }
                sections.push(section)
            }

            section.events.push(event)
            section.count++
        }

        this.setState(prevState => ({
            sections,
            expanded: prevState.hasInitExpanded && sections.length > 0 ? prevState.expanded : Set(sections.length > 0 ? [sections[0].key] : []),
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    private toggleSection = (key: string) => {
        this.setState(prevState => {
                let expanded: Set<string> = prevState.expanded
                expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                return {
                    expanded
                }
            }
        )
    }

    private padHours = (hours: number): string => {
        if (hours === 24)
            hours = 0;
        if (hours < 10) return "0" + hours

        return hours.toString()
    }

    private keyExtractor = (event: EventEntity): string => {
        return event.id.toString()
    }
}

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


// Connect compoentn to store and appstate


function mapEvents(state: AppStore): EventEntity[] {
    const events: EventEntity[] = []
    for (let eventId of state.soonStore.soonEvents) {
        let eventEntity = state.entityStore.events.get(eventId);
        if (eventEntity) {
            events.push(eventEntity)
        }
    }

    return events
}

const mapStateToProps = (state: AppStore): StateProps => ({
    loading: state.soonStore.loading,
    events: mapEvents(state)
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean): any => dispatch(SoonActions.load(fireStartLoad))
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(StartingSoonScreen))

export const LiveEventsWithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

export default LiveEventsWithData