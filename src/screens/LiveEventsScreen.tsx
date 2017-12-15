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
import Icon from 'react-native-vector-icons/Ionicons';
import {Set} from "immutable"
import {NavigationScreenProp} from "react-navigation";
import {EventGroup, LiveEvent} from "api/typings";
import EventListItem from "components/EventListItem";
import {orientation} from "lib/device";
import autobind from "autobind-decorator";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as LiveActions from "store/live/actions"
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import Screen from "screens/Screen";
import Touchable from "components/Touchable";

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
    expanded: Set<number>
}

interface LiveSection extends SectionListData<EventEntity> {
    count: number,
    order: number
}

class LiveEventsScreen extends React.Component<ComponentProps, State> {

    constructor() {
        super();
        this.state = {
            refreshing: false,
            expanded: Set([0])
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<State>, nextContext: any): boolean {
        return nextProps.loading !== this.props.loading ||
            nextProps.favorites.count() !== this.props.favorites.count() ||
            nextProps.events.length !== this.props.events.length ||
            nextState.expanded !== this.state.expanded
    }

    componentDidMount(): void {
        this.props.loadData(true)
    }

    public render() {
        return (
            <Screen title="Live right now" {...this.props} rootScreen>
                {this.renderBody()}
            </Screen>
        )
    }

    public renderBody() {
        const {loading, events, groups, favorites} = this.props;
        let { expanded} = this.state


        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }

        const sections: LiveSection[] = groups.map(group => ({
            title: group.englishName,
            sport: group.sport,
            sortOrder: group.sortOrder && parseInt(group.sortOrder, 10) || 100,
            data: events.filter(event => event.sport === group.sport),
            order: 0,
            count: 0
        })).sort((a, b) => a.sortOrder - b.sortOrder);

        if (!favorites.isEmpty()) {
            sections.unshift({
                title: "Favorites",
                sport: "arne",
                sortOrder: 0,
                data: events.filter(event => favorites.contains(event.id)),
                order: 0,
                count: 0
            })
        }

        let i = 0;
        for (let sec of sections) {
            sec.order = i
            sec.count = sec.data.length
            if (!expanded.has(i)) {
                sec.data = []
            }
            i++;
        }


        return (
            <SectionList
                stickySectionHeadersEnabled={true}
                refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}
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
        const event: EventEntity = info.item;
        let orient = orientation();
        return <EventListItem eventId={event.id}
                              navigation={this.props.navigation}
                              orientation={orient}/>
    }

    @autobind
    private renderSectionHeader(info: { section: LiveSection }) {
        if (info.section.title === "Favorites") {
            if (info.section.data.length === 0) {
                return null
            }
            return (
                <View style={headerStyle}>
                    <Icon style={{padding: 0}}
                          name="ios-star"
                          size={30}
                          color="darkorange"/>
                    <Text style={sportTextStyle}>{info.section.title}</Text>
                    <Text style={countTextStyle}>{info.section.data.length}</Text>
                </View>
            )
        }
        return (
            <Touchable onPress={() => this.toggleSection(info.section.order)}>
                <View style={headerStyle}>
                    <Text style={liveTextStyle}>Live</Text>
                    <Text style={sportTextStyle}>{info.section.title}</Text>
                    <Text style={countTextStyle}>{info.section.count}</Text>
                </View>
            </Touchable>
        )
    }

    private keyExtractor(event: EventEntity): string {
        return event.id.toString()
    }

    @autobind
    private toggleSection(order: number) {
        this.setState(prevState => {
                let expanded: Set<number> = prevState.expanded
                expanded = expanded.has(order) ? expanded.delete(order) : expanded.add(order)
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