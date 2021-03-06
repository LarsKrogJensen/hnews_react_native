import * as React from "react"
import {ComponentClass} from "react"
import {NavigationActions, NavigationNavigateAction, NavigationScreenProp} from "react-navigation";
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
import Touchable from "components/Touchable";
import {AppStore} from "store/store";
import {Dispatch} from "redux";
import {loadGroups, loadHighlights} from "store/groups/actions";
import {connect} from "react-redux";
import {EventGroup} from "api/typings";
import connectAppState from "components/hoc/AppStateRefresh";
import {loadOpenForLive} from "store/live/actions";
import {navigate} from "lib/navigate";
import absoluteFill = StyleSheet.absoluteFill;

interface ExternalProps {
    navigation: NavigationScreenProp<{}>
}

interface StateProps {
    loading: boolean,
    sports: EventGroup[],
    highlights: EventGroup[]
}

interface DispatchProps {
    loadData: (fireStartLoad: boolean) => void
}

type Props = DispatchProps & StateProps & ExternalProps

interface Item {
    name: string
    group?: EventGroup
    count?: number
    live?: boolean
    path: string,
    action?: NavigationNavigateAction
}

class DrawerComp extends React.Component<Props> {


    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<{}>, nextContext: any): boolean {
        if (nextProps.loading !== this.props.loading) return true
        if (nextProps.sports.length !== this.props.sports.length) return true
        if (nextProps.highlights.length !== this.props.highlights.length) return true
        // if (nextProps.sports.map(s => s.id).join() !== this.props.sports.map(s => s.id).join()) return true
        // if (nextProps.highlights.map(s => s.id).join() !== this.props.highlights.map(s => s.id).join()) return true


        return false
    }

    componentDidMount(): void {
        this.props.loadData(true)
    }

    render() {
        // console.log("Drawer rendering")
        return (
            <View style={{backgroundColor: "#333333", flex: 1, flexDirection: "column", paddingBottom: 12}}>
                <View style={{height: 100, justifyContent: "center", alignItems: "center"}}>
                    <Image style={absoluteFill} source={{uri: banner}}/>
                    <Text style={{
                        color: "white",
                        backgroundColor: "transparent",
                        fontSize: 24,
                        fontWeight: "bold"
                    }}>PLAY</Text>
                </View>
                <View style={{flex: 1}}>
                    {this.renderBody()}
                </View>
            </View>
        )
    }

    private renderBody = () => {
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
                    {name: "Starting Soon", path: "Soon"},
                ]
            },
            {
                title: "Popular",
                data: this.props.highlights.map(group => ({
                    name: group.name,
                    path: "Sport",
                    count: group.boCount,
                    category: group.pathTermId,
                    group,
                    action: this.createNavigtionAction(group)
                }))
            },
            {
                title: "Sports",
                data: this.props.sports.filter(group => group.sortOrder).map(group => ({
                    name: group.name,
                    path: "Sport",
                    count: group.boCount,
                    group,
                    action: this.createNavigtionAction(group)
                }))
            },
            {
                title: "More Sports",
                data: this.props.sports.filter(group => !group.sortOrder).map(group => ({
                    name: group.name,
                    path: "Sport",
                    count: group.boCount,
                    group,
                    action: this.createNavigtionAction(group)
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

    private renderItem = (info: ListRenderItemInfo<Item>) => {
        const item: Item = info.item;
        const navigation = this.props.navigation

        return (
            <Touchable onPress={() => this.onItemClick(navigation, item)}>
                <View style={{height: 44, flexDirection: "row", alignItems: "center"}}>
                    {item.live && <Text style={{color: "red", fontSize: 16, marginLeft: 16}}>Live</Text>}
                    <Text style={{color: "white", fontSize: 16, marginLeft: item.live ? 3 : 16}}>{item.name}</Text>
                    <Text style={{
                        color: "#dcdcdc",
                        fontSize: 11,
                        flex: 1,
                        marginLeft: 8
                    }}>{this.formatCategory(item.group)}</Text>
                    <Text style={{color: "#dcdcdc", fontSize: 11, marginRight: 8}}>{item.count}</Text>
                </View>
            </Touchable>
        )
    }

    private createNavigtionAction(group: EventGroup): NavigationNavigateAction {
        let sport = "all"
        let region = "all"
        let league = "all"
        let participant = "all"

        if (group.parentGroup) {
            if (group.parentGroup.parentGroup) {
                sport = group.parentGroup.parentGroup.termKey
                region = group.parentGroup.termKey
                league = group.termKey
            } else {
                sport = group.parentGroup.termKey
                region = group.termKey
            }
        } else {
            sport = group.termKey
        }

        return NavigationActions.navigate({
            routeName: 'Spring',
            params: {sport, region, league, participant, title: group.name}
        })
    }

    private formatCategory = (group: EventGroup | undefined): string | null => {
        if (!group) return null

        let eg = group;
        const flattenPath: string[] = []
        while (eg.parentGroup) {
            flattenPath.unshift(eg.parentGroup.name)
            eg = eg.parentGroup
        }

        return flattenPath.join(" / ")
    }

    private renderSectionHeader = (info: { section: SectionListData<Item> }) => {
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

    private keyExtractor = (item: Item): string => {
        return item.name
    }

    private onItemClick = (navigation: NavigationScreenProp<any>, item: Item) => {
        if (navigation && item.path) {
            if (item.action) {
                let action = NavigationActions.reset({
                        index: 0,
                        key: null,
                        actions: [
                            item.action
                        ]
                    }
                );
                navigation.navigate(item.path, {}, action)
            } else {
                navigate(navigation, item.path)
            }
        }
    }
}

const mapStateToProps = (state: AppStore): StateProps => ({
    loading: state.groupStore.highlightsLoading || state.groupStore.groupsLoading,
    sports: state.groupStore.sports.map(id => state.groupStore.groupById.get(id)).filter(g => g),
    highlights: state.groupStore.highlights.map(id => state.groupStore.groupById.get(id)).filter(g => g)
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => (
    {
        loadData: (fireStartLoad: boolean) => {
            dispatch(loadGroups(fireStartLoad))
            dispatch(loadHighlights(fireStartLoad))
            dispatch(loadOpenForLive(false))
        }
    }
)

const WithAppStateRefresh: ComponentClass<Props> =
    connectAppState((props: Props, incrementalLoad: boolean) => props.loadData(!incrementalLoad))(DrawerComp)

export const Drawer: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(WithAppStateRefresh)

