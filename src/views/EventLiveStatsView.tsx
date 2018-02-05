import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import {Occurence} from "api/typings";
import {OrientationProps, withOrientationChange} from "components/OrientationChange";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {loadLiveData} from "store/stats/actions";
import {AppStore} from "store/store";
import {EventEntity} from "model/EventEntity";
import connectAppState from "components/AppStateRefresh";
import autobind from "autobind-decorator";

interface ExternalProps {
    eventId: number
    eventGroupId: number
    style?: ViewStyle
}

interface ComponentState {
}

interface DispatchProps {
    loadData: (fireStartLoad?: boolean) => void
}

interface StateProps {
    loading: boolean,
    occurences?: Occurence[]
    event?: EventEntity
}

type ComponentProps = StateProps & DispatchProps & ExternalProps & OrientationProps

class EventLiveStatsViewComponent extends React.Component<ComponentProps, ComponentState> {
    shouldComponentUpdate(nextProps: Readonly<ComponentProps>, nextState: Readonly<ComponentState>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.eventId !== this.props.eventId) return true
        if (!this.occerencesEquals(nextProps.occurences, this.props.occurences)) return true
        if (nextProps.orientation !== this.props.orientation) return true;

        return false
    }

    componentDidMount(): void {
        this.props.loadData()
    }

    public render() {
        console.log("render event feed")
        const {loading, style, occurences} = this.props;
        if (loading) {
            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }
        if (!occurences) {
            return null
        }

        return this.renderBody(occurences)
    }

    private renderBody(occurences: Occurence[]) {
        const data: Occurence[] = occurences.sort((o1, o2) => o2.secondInMatch - o1.secondInMatch)

        return <FlatList
            data={data}
            style={this.props.style}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
        />
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<Occurence>) {
        const occurence = info.item
        return (
            <View key={occurence.id} style={styles.row}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text>{JSON.stringify(occurence)}</Text>
                </View>
            </View>
        )
    }

    @autobind
    private keyExtractor(item: Occurence) {
        return item.id.toString()
    }

    private occerencesEquals(o1?: Occurence[], o2?: Occurence[]): boolean {
        if (o1 && o2) {
            if (o1.length !== o2.length) return false;
            //if (o1.map(o => o.id).join() !== o2.map(o => o.id).join()) return false
        } else if (!o1 && o2) {
            return false
        } else if (o1 && !o2) {
            return false
        }

        return true
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 8
    } as TextStyle,
    row: {
        padding: 8,
        backgroundColor: "white",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "column",
        alignItems: "center",
        borderColor: "#D1D1D1"
    },
    resultBox: {
        width: 50,
        height: 40,
        marginRight: 4,
        backgroundColor: "black",
        borderRadius: 3,
        justifyContent: "center",
        alignItems: "center"
    } as ViewStyle,
    result: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    } as TextStyle,
    team: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 16
    } as TextStyle
})

// Redux connect
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.statsStore.liveDataLoading.has(inputProps.eventId),
    occurences: state.statsStore.occurences.get(inputProps.eventId),
    event: state.entityStore.events.get(inputProps.eventId)
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    loadData: (fireStartLoad: boolean = true) => {
        dispatch(loadLiveData(inputProps.eventId, fireStartLoad))
    },
})

const WithAppStateRefresh: ComponentClass<ComponentProps> =
    connectAppState((props: ComponentProps, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(withOrientationChange(EventLiveStatsViewComponent))

export const EventLiveStatsView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(withOrientationChange(WithAppStateRefresh))

