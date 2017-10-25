import * as React from "react"
import {ActivityIndicator, FlatList, ListRenderItemInfo, RefreshControl, View} from "react-native"
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
        const {loading, events} = this.props;

        if (loading) {
            return <View>
                <ActivityIndicator size="large"/>
            </View>
        }

        return (
            <View>
                <FlatList
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}
                    data={events}
                    keyExtractor={this.keyExctractor}
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

    private keyExctractor(liveEvent: LiveEvent): string {
        return liveEvent.event.id.toString()
    }
}