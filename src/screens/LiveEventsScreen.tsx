import * as React from "react"
import {ActivityIndicator, FlatList, ListRenderItemInfo, View} from "react-native"
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

export default class LiveEventsScreen extends React.Component<Props> {

    constructor() {
        super();
        this.renderItem = this.renderItem.bind(this);
        this.keyExctractor = this.keyExctractor.bind(this);
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
                <FlatList data={events}
                          keyExtractor={this.keyExctractor}
                          renderItem={this.renderItem}/>
            </View>
        )
    }

    private renderItem(info: ListRenderItemInfo<LiveEvent>) {
        const liveEvent: LiveEvent = info.item;
        return <LiveEventListItem liveEvent={liveEvent}/>
    }

    private keyExctractor(liveEvent: LiveEvent): string {
        return liveEvent.event.id.toString()
    }
}