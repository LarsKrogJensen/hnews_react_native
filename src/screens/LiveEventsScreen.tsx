import * as React from "react"
import {
    ActivityIndicator,
    ListRenderItemInfo,
    RefreshControl,
    SectionList,
    SectionListData,
    Text,
    View,
    ViewStyle
} from "react-native"
import {NavigationScreenProp} from "react-navigation";
import {EventGroup, LiveEvent} from "api/typings";
import LiveEventListItem from "components/LiveEventListItem";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
    loading: boolean,
    events: LiveEvent[]
    groups: EventGroup[]
    load: () => void
}

interface State {
    refreshing: boolean
}


export default class LiveEventsScreen extends React.Component<Props, State> {

    constructor() {
        super();
        this.state = {
            refreshing: false
        }
        this.renderItem = this.renderItem.bind(this);
        this.keyExctractor = this.keyExctractor.bind(this);
        this.onRefresh = this.onRefresh.bind(this)
    }

    componentDidMount(): void {
        this.props.load()
    }

    public render() {
        const {loading, events, groups} = this.props;

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


        return (
            <View>
                <SectionList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}
                    sections={sections}
                    keyExtractor={this.keyExctractor}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}/>
            </View>
        )
    }

    private onRefresh() {
        this.props.load()
    }

    private renderItem(info: ListRenderItemInfo<LiveEvent>) {
        const liveEvent: LiveEvent = info.item;
        return <LiveEventListItem liveEvent={liveEvent}/>
    }

    private renderSectionHeader(info: { section: SectionListData<LiveEvent> }) {
        return (
            <View style={headerStyle}>
                <Text style={{color: "red", fontSize: 14}}>Live</Text>
                <Text style={{fontSize: 14, marginLeft: 8}}>{info.section.title}</Text>
            </View>
        )
    }

    private keyExctractor(liveEvent: LiveEvent): string {
        return liveEvent.event.id.toString()
    }
}

const headerStyle: ViewStyle = {
    padding: 8,
    backgroundColor: "white",
    borderBottomColor: "#D1D1D1",
    borderBottomWidth: 1,
    flexDirection: "row"
}