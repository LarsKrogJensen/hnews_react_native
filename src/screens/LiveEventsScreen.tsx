import * as React from "react"
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
import ActionDelegate from "store/ActionDelegate";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
    loading: boolean,
    events: LiveEvent[]
    groups: EventGroup[]
    loadData: () => void
    actions: ActionDelegate,
    favorites: Set<number>
}

interface State {
    refreshing: boolean,
    // orientation: Orientation
}

export default class LiveEventsScreen extends React.PureComponent<Props, State> {

    constructor() {
        super();
        this.state = {
            refreshing: false // ,
            // orientation: orientation()
        }

        this.orientationDidChange = this.orientationDidChange.bind(this)
    }

    componentDidMount(): void {
        this.props.loadData()
        // Orientation.addOrientationListener(this._orientationDidChange)
        // Dimensions.addEventListener("change", this.orientationDidChange)
    }

    componentWillUnmount() {
        // Orientation.removeOrientationListener(this._orientationDidChange)
    }

    @autobind
    orientationDidChange() {
        console.log("orientation change")
        // this.setState({orientation: orientation()})
    }

    public render() {
        const {loading, events, groups, favorites} = this.props;

        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }

        const sections: SectionListData<LiveEvent>[] = groups.map(group => ({
            title: group.englishName,
            sport: group.sport,
            sortOrder: group.sortOrder && parseInt(group.sortOrder, 10) || 100,
            data: events.filter(liveEvent => liveEvent.event.sport === group.sport)
        })).sort((a, b) => a.sortOrder - b.sortOrder);

        if (!favorites.isEmpty()) {
            sections.unshift({
                title: "Favorites",
                sport: "arne",
                sortOrder: 0,
                data: events.filter(liveEvent => favorites.contains(liveEvent.event.id))
            })
        }

        return (
            <View>
                <SectionList
                    stickySectionHeadersEnabled={true}
                    refreshControl={<RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh}/>}
                    sections={sections}
                    keyExtractor={this.keyExctractor}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}/>
            </View>
        )
    }

    @autobind
    private onRefresh() {
        console.log("Refreshing")
        this.props.loadData()
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<LiveEvent>) {
        const liveEvent: LiveEvent = info.item;
        let orient = orientation();
        return <LiveEventListItem liveEvent={liveEvent}
                                  navigation={this.props.navigation}
                                  orientation={orient}
                                  actions={this.props.actions}/>
    }

    @autobind
    private renderSectionHeader(info: { section: SectionListData<LiveEvent> }) {
        if (info.section.title === "Favorites") {
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

    private keyExctractor(liveEvent: LiveEvent): string {
        return liveEvent.event.id.toString()
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