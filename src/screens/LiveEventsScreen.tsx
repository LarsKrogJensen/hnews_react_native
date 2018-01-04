import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator, Animated, ListRenderItemInfo, RefreshControl, SectionList, SectionListData, Text, TextStyle,
    View, ViewStyle
} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';
import {is, Set} from "immutable"
import {NavigationScreenProp} from "react-navigation";
import {EventGroup} from "api/typings";
import EventListItem from "components/EventListItem";
import {orientation} from "lib/device";
import autobind from "autobind-decorator";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as LiveActions from "store/live/actions"
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import Touchable from "components/Touchable";
import {CollapsableHeaderScreen, NAVBAR_HEIGHT, ScrollHooks} from "screens/CollapsableHeaderScreen";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface DispatchProps {
    loadData: (fireStartLoading: boolean) => void
}

interface StateProps {
    loading: boolean,
    events: EventEntity[]
    groups: EventGroup[]
    favorites: Set<number>
}

type ComponentProps = StateProps & DispatchProps & ExternalProps

interface State {
    refreshing: boolean
    expanded: Set<string>
    sections: LiveSection[]
    hasInitExpanded: boolean
}

interface LiveSection extends SectionListData<EventEntity> {
    count: number
    events: EventEntity[]
    key: string
    sport: string
    sortOrder: number
}

const AnimatedSectionList: SectionList<EventEntity> = Animated.createAnimatedComponent(SectionList);

class LiveEventsScreen extends React.Component<ComponentProps, State> {

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
        if (nextProps.events.length !== this.props.events.length) return true
        if (nextProps.events.map(e => e.id).join() !== this.props.events.map(e => e.id).join()) return true
        if (!is(nextProps.favorites, this.props.favorites)) return true
        if (!is(nextState.expanded, this.state.expanded)) return true

        return false
    }

    componentDidMount(): void {
        this.props.loadData(true)
        if (this.props.events.length) {
            this.prepareData(this.props.events, this.props.groups, this.props.favorites)
        }
    }

    componentWillReceiveProps(nextProps: Readonly<ComponentProps>, nextContext: any): void {
        if (!nextProps.loading && (
                nextProps.events.length !== this.props.events.length ||
                nextProps.events.map(e => e.id).join() !== this.props.events.map(e => e.id).join() ||
                !is(nextProps.favorites, this.props.favorites))
        ) {
            this.prepareData(nextProps.events, nextProps.groups, nextProps.favorites)
        }
    }

    public render() {
        return (
            <CollapsableHeaderScreen {...this.props}
                                     title="Live right now"
                                     rootScreen
                                     renderBody={this.renderBody}/>
        )
    }

    @autobind
    private renderBody(scrollHooks: ScrollHooks) {
        const {loading} = this.props;
        let {expanded, sections} = this.state


        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: NAVBAR_HEIGHT + 8}}/>
            </View>
        }

        const sectionsView = sections.map(section => ({
            ...section,
            data: expanded.has(section.key) ? section.events : []
        }));

        // console.log("Rendering LiveScreen sections: " + sectionsView.length)
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

    @autobind
    private onRefresh() {
        this.props.loadData(true)
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<EventEntity>) {
        const event: EventEntity = info.item;
        let orient = orientation();
        return <EventListItem eventId={event.id}
                              navigation={this.props.navigation}
                              orientation={orient}/>
    }

    @autobind
    private renderSectionHeader(info: { section: LiveSection }) {
        if (info.section.title === "Favorites") {

            return (
                <Touchable onPress={() => this.toggleSection(info.section.key)}>
                    <View style={headerStyle}>
                        <Icon style={{padding: 0}}
                              name="ios-star"
                              size={30}
                              color="darkorange"/>
                        <Text style={sportTextStyle}>{info.section.title}</Text>
                        <Text style={countTextStyle}>{info.section.count}</Text>
                    </View>
                </Touchable>
            )
        }
        return (
            <Touchable onPress={() => this.toggleSection(info.section.key)}>
                <View style={headerStyle}>
                    <Text style={liveTextStyle}>Live</Text>
                    <Text style={sportTextStyle}>{info.section.title}</Text>
                    <Text style={countTextStyle}>{info.section.count}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
    private keyExtractor(event: EventEntity): string {
        return event.id.toString()
    }

    private prepareData(events: EventEntity[],
                        groups: EventGroup[],
                        favorites: Set<number>) {
        // console.log("Prepare live data")
        const sections: LiveSection[] = groups.map(group => ({
            title: group.englishName,
            sport: group.sport,
            sortOrder: group.sortOrder && parseInt(group.sortOrder) || 100,
            events: events.filter(event => event.sport === group.sport),
            data: [],
            count: 0,
            key: group.englishName
        })).sort((a, b) => a.sortOrder - b.sortOrder);

        if (!favorites.isEmpty()) {
            sections.unshift({
                key: "favorites",
                title: "Favorites",
                sport: "arne",
                sortOrder: 0,
                events: events.filter(event => favorites.contains(event.id)),
                count: 0,
                data: []
            })
        }


        for (let sec of sections) {
            sec.count = sec.events.length
        }

        this.setState(prevState => ({
            sections,
            expanded: prevState.hasInitExpanded && sections.length > 0 ? prevState.expanded : Set(sections.length > 0 ? [sections[0].key] : []),
            hasInitExpanded: prevState.hasInitExpanded || sections.length > 0
        }))
    }

    @autobind
    private toggleSection(key: string) {
        this.setState(prevState => {
                let expanded: Set<string> = prevState.expanded
                expanded = expanded.has(key) ? expanded.delete(key) : expanded.add(key)
                return {
                    expanded: expanded
                }
            }
        )
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
    for (let eventId of state.liveStore.liveEvents) {
        let eventEntity = state.entityStore.events.get(eventId);
        if (eventEntity) {
            events.push(eventEntity)
        }
    }

    return events
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.liveStore.loading,
    events: mapEvents(state),
    groups: state.liveStore.groups,
    favorites: state.favoriteStore.favorites
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean): any => dispatch(LiveActions.loadOpenForLive(fireStartLoad))
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps) => props.loadData(false))(LiveEventsScreen)

export const LiveEventsWithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

export default LiveEventsWithData