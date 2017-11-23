import * as React from "react"
import {ComponentClass} from "react"
import {NavigationScreenProp} from "react-navigation";
import {
    ActivityIndicator,
    Image,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    View
} from "react-native";
import banner from "images/banner";
import autobind from "autobind-decorator";
import Touchable from "components/Touchable";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {loadGroups, loadHighlights} from "store/groups/actions";
import connectAppState from "components/AppStateRefresh";
import {connect} from "react-redux";
import absoluteFill = StyleSheet.absoluteFill;
import {EventGroup} from "api/typings";

interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface StateProps {
    loading: boolean,
    sports: EventGroup[],
    highlights: EventGroup[]
}

interface DispatchProps {
    loadData: () => void
}

type Props = DispatchProps & StateProps & ExternalProps

interface Item {
    name: string
    category?: string
    count?: number
    live?: boolean
    path: string
}

class Drawer extends React.Component<Props> {
    componentDidMount(): void {
        this.props.loadData()
    }

    render() {

        return (
            <View style={{backgroundColor: "#333333", flexDirection: "column", paddingBottom: 12}}>
                <View style={{height: 100, justifyContent: "center", alignItems: "center"}}>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Text style={{color: "white", fontSize: 24, fontWeight: "bold"}}>PLAY</Text>
                </View>
                {this.renderBody()}
            </View>
        )
    }

    @autobind
    private renderBody() {
        if (this.props.loading) {
            return <View>
                <ActivityIndicator style={{marginTop: 8}}/>
            </View>
        }
        const sections: SectionListData<Item>[] = [
            {
                title: "",
                data: [
                    {name: "Home", path: "Home"},
                    {name: "Right Now", path: "Live", live: true},
                    {name: "Starting Soon", path: "Live"}
                ]
            },
            {
                title: "Popular",
                data: this.props.highlights.map(group => ({
                    name: group.name,
                    path: "Event",
                    count: group.boCount,
                    category: group.pathTermId
                }))
            },
            {
                title: "Sports",
                data: this.props.sports.filter(group => group.sortOrder).map(group => ({
                    name: group.name,
                    path: "Event",
                    count: group.boCount
                }))
            },
            {
                title: "More Sports",
                data: this.props.sports.filter(group => !group.sortOrder).map(group => ({
                    name: group.name,
                    path: "Event",
                    count: group.boCount
                }))
            }
        ]

        return (
            <SectionList
                stickySectionHeadersEnabled={true}
                sections={sections}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    @autobind
    private renderItem(info: ListRenderItemInfo<Item>) {
        const item: Item = info.item;

        return (
            <Touchable onPress={() => this.onItemClick(item)}>
                <View style={{height: 44, flexDirection: "row", alignItems: "center"}}>
                    {item.live && <Text style={{color: "red", fontSize: 16, marginLeft: 16}}>Live</Text>}
                    <Text style={{color: "white", fontSize: 16, marginLeft: item.live ? 3 : 16}}>{item.name}</Text>
                    <Text style={{color: "#dcdcdc", fontSize: 11, flex: 1, marginLeft: 8}}>{item.category}</Text>
                    <Text style={{color: "#dcdcdc", fontSize: 11, marginRight: 8}}>{item.count}</Text>
                </View>
            </Touchable>
        )
    }

    @autobind
    private renderSectionHeader(info: { section: SectionListData<Item> }) {
        if (!info.section.title) return null;

        return (
            <View style={{
                backgroundColor: "#333333",
                borderTopWidth: 1,
                borderTopColor: "#626262",
                paddingTop: 8,
                paddingBottom: 8
            }}>
                <Text style={{
                    color: "#dcdcdc",
                    fontSize: 12,
                    fontWeight: "bold",
                    marginLeft: 8
                }}>{info.section.title}</Text>
            </View>
        )
    }

    @autobind
    private keyExtractor(item: Item): string {
        return item.name
    }

    @autobind
    private onItemClick(item: Item) {
        if (item.path) {
            this.props.navigation.navigate(item.path)
        }
    }
}

const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.groupStore.highlightsLoading || state.groupStore.groupsLoading,
    sports: state.groupStore.sports.map(id => state.groupStore.groupById.get(id)),
    highlights: state.groupStore.highlights.map(id => state.groupStore.groupById.get(id))
})

const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => (
    {
        loadData: () => {
            dispatch(loadGroups())
            dispatch(loadHighlights())
        }
    }
)

const WithAppStateRefresh: ComponentClass<Props> =
    connectAppState((props: Props) => props.loadData())(Drawer)

const WithData: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

export default WithData