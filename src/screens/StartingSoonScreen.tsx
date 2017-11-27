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
import {NavigationScreenProp} from "react-navigation";
import LiveEventListItem from "components/EventListItem";
import {orientation} from "lib/device";
import autobind from "autobind-decorator";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import * as SoonActions from "store/soon/actions"
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import Screen from "screens/Screen";
import Touchable from "components/Touchable";
import {Set} from "immutable"

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

type ComponentProps = StateProps & DispatchProps & ExternalProps

interface State {
    refreshing: boolean
    expanded: Set<string>
}

interface DateSection extends SectionListData<EventEntity> {
    date: Date,
    count: number
}

class StartingSoonScreen extends React.Component<ComponentProps, State> {
    // private
    private today = new Date()
    private todayStr: string
    private tomorrow = new Date()
    private toMorrowStr: string

    constructor() {
        super();
        this.todayStr = this.today.toDateString()
        this.tomorrow.setDate(this.today.getDate() + 1)
        this.toMorrowStr = this.tomorrow.toDateString()
        this.state = {
            refreshing: false,
            expanded: Set()
        }
    }

    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<State>, nextContext: any): boolean {
        return nextProps.loading !== this.props.loading ||
            nextProps.events.length !== this.props.events.length ||
            nextState.expanded !== this.state.expanded
    }

    componentDidMount(): void {
        this.props.loadData(true)
    }

    public render() {
        return (
            <Screen title="Starting Soon" {...this.props} rootScreen>
                {this.renderBody()}
            </Screen>
        )
    }

    public renderBody() {
        const {loading, events} = this.props;
        const {expanded} = this.state

        if (loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }

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
                    date: date,
                    data: [],
                    count: 0
                }
                sections.push(section)
            }

            if (expanded.has(date.toISOString())) {
                section.data.push(event)
            }
            section.count++
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
        return <LiveEventListItem eventId={event.id}
                                  navigation={this.props.navigation}
                                  orientation={orient}/>
    }

    @autobind
    private renderSectionHeader(info: { section: DateSection }) {
        const date = info.section.date;
        const dateStr = date.toDateString()

        let datum = ""
        if (dateStr === this.todayStr) {
            datum = "Today"
        } else if (dateStr === this.toMorrowStr) {
            datum = "Tomorrow"
        } else {
            datum = dateStr
        }

        let hour = ""
        if (datum === "Today" && date.getHours() === this.today.getHours()) {
            hour = "Next up"
        } else {
            hour = `${this.padHours(date.getHours())}:00 - ${this.padHours(date.getHours() + 1)}:00`
        }

        return (
            <Touchable onPress={() => this.toggleSection(info.section.date.toISOString())}>
                <View style={headerStyle}>
                    <Text style={liveTextStyle}>{hour}</Text>
                    <Text style={sportTextStyle}>{datum}</Text>
                    <Text style={countTextStyle}>{info.section.count}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
    private toggleSection(name: string) {
        this.setState(prevState => {
                let expanded: Set<string> = prevState.expanded
                expanded = expanded.has(name) ? expanded.delete(name) : expanded.add(name)
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

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.soonStore.loading,
    events: mapEvents(state)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean): any => dispatch(SoonActions.load(fireStartLoad))
    }
)

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(StartingSoonScreen)

export const LiveEventsWithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

export default LiveEventsWithData