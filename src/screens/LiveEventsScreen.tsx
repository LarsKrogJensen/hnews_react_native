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
import LiveEventListItem from "components/LiveEventListItem";
import {orientation} from "lib/device";
import autobind from "autobind-decorator";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as LiveActions from "store/live/actions"
import {EventEntity} from "model/EventEntity";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
    loading: boolean,
    events: EventEntity[]
    groups: EventGroup[]
    loadData: () => void
    favorites: Set<number>
}

interface State {
    refreshing: boolean
}

class LiveEventsScreen extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            refreshing: false
        }
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        return nextProps.loading !== this.props.loading ||
            nextProps.favorites.count() !== this.props.favorites.count() ||
            nextProps.events.length !== this.props.events.length
    }

    componentDidMount(): void {
        this.props.loadData()
    }


    public render() {
        const {loading, events, groups, favorites} = this.props;

        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }

        const sections: SectionListData<EventEntity>[] = groups.map(group => ({
            title: group.englishName,
            sport: group.sport,
            sortOrder: group.sortOrder && parseInt(group.sortOrder, 10) || 100,
            data: events.filter(event => event.sport === group.sport)
        })).sort((a, b) => a.sortOrder - b.sortOrder);

        if (!favorites.isEmpty()) {
            sections.unshift({
                title: "Favorites",
                sport: "arne",
                sortOrder: 0,
                data: events.filter(event => favorites.contains(event.id))
            })
        }

        // console.log("LitScreen render")
        return (
            <View>
                <SectionList
                    stickySectionHeadersEnabled={true}
                    refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}
                    sections={sections}
                    renderSectionHeader={this.renderSectionHeader}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
                {/*<FlatList*/}
                {/*data={events}*/}
                {/*keyExtractor={this.keyExctractor}*/}
                {/*renderItem={this.renderItem}*/}
                {/*extraData={this.props.favorites.count()}*/}
                {/*/>*/}
            </View>
        )
    }

    @autobind
    private onRefresh() {
        this.props.loadData()
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<EventEntity>) {
        const event: EventEntity = info.item;
        let orient = orientation();
        return <LiveEventListItem eventId={event.id}
                                  navigation={this.props.navigation}
                                  orientation={orient}/>
    }

    @autobind
    private renderSectionHeader(info: { section: SectionListData<LiveEvent> }) {
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
            <View style={headerStyle}>
                <Text style={liveTextStyle}>Live</Text>
                <Text style={sportTextStyle}>{info.section.title}</Text>
                <Text style={countTextStyle}>{info.section.data.length}</Text>
            </View>
        )
    }

    private keyExtractor(event: EventEntity): string {
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


interface PropsIn {
    navigation: NavigationScreenProp<{}, {}>
}

interface DispatchProps {
    loadData: () => void
}

interface StateProps {
    navigation: NavigationScreenProp<{}, {}>
    loading: boolean,
    events: EventEntity[]
    groups: EventGroup[]
    favorites: Set<number>
}

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

const mapStateToProps = (state: AppStore, inputProps: PropsIn): StateProps => ({
    loading: state.liveStore.loading,
    events: mapEvents(state),
    groups: state.liveStore.groups,
    favorites: state.favoriteStore.favorites,
    navigation: inputProps.navigation
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: PropsIn): DispatchProps => (
    {
        loadData: (): any => dispatch(LiveActions.load())
    }
)

const LiveEventsWithData: ComponentClass<PropsIn> =
    connect<StateProps, DispatchProps, PropsIn>(mapStateToProps, mapDispatchToProps)(LiveEventsScreen)

export default LiveEventsWithData