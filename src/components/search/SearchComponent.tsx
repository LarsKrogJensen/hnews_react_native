import * as React from "react"
import {ComponentClass} from "react"
import {
    ActivityIndicator,
    ListRenderItemInfo,
    SectionList,
    SectionListData,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";
import {ResultTerm, SearchResult} from "api/typings";
import {NavigationActions, NavigationScreenProp} from "react-navigation";
import Touchable from "components/Touchable";
import {AppStore} from "store/store";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {search} from "store/search/actions";

interface ExternalProps {
    navigation: NavigationScreenProp<{}>
    searchText: string
    style: ViewStyle
}

interface StateProps {
    loading: boolean
    result?: SearchResult
}

interface DispatchProps {
    search: () => void
}

type Props = StateProps & ExternalProps & DispatchProps

interface SearchSection extends SectionListData<ResultTerm> {
    key: string
    title
}

class SearchComponent extends React.Component<Props> {

    componentDidMount(): void {
        if (this.props.searchText.length > 2) {
            this.props.search()
        }
    }


    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if (nextProps.searchText !== this.props.searchText && nextProps.searchText.length > 2) {
            nextProps.search()
        }
    }

    public render() {
        const {style, result, loading, searchText} = this.props

        if (loading) {
            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        if (!result) {
            return (
                <View style={style}>
                    <Text style={{fontSize: 14, margin: 8}}>Start search</Text>
                </View>
            )
        }

        if (result && !result.resultTerms.length && searchText) {
            return (
                <View style={style}>
                    <Text style={{fontSize: 14, margin: 8}}>No matches</Text>
                </View>
            )
        }

        const teamSection: SearchSection = {
            title: "Teams & Players",
            key: "teams",
            data: result.resultTerms.filter(term => term.type === "PARTICIPANT" && result.searchHitsId.indexOf(term.id) > -1)
        }

        const otherSection: SearchSection = {
            title: "Sports, Regions & Leagues",
            key: "other",
            data: result.resultTerms.filter(term => term.type !== "PARTICIPANT" && result.searchHitsId.indexOf(term.id) > -1)
        }

        const sections: SearchSection[] = []
        if (teamSection.data.length) {
            sections.push(teamSection)
        }
        if (otherSection.data.length) {
            sections.push(otherSection)
        }

        return (
            <SectionList
                keyboardShouldPersistTaps='always'
                style={style}
                stickySectionHeadersEnabled={true}
                sections={sections}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
            />
        )
    }

    private keyExtractor = (term: ResultTerm): string => {
        return term.id
    }

    private renderItem = (info: ListRenderItemInfo<ResultTerm>) => {
        let term = info.item;
        return (
            <Touchable onPress={() => this.handleItemClick(term)}>
                <View style={styles.item}>
                    <Text style={styles.itemTitle}>{term.localizedName}</Text>
                    <Text style={styles.itemSubtitle}>{this.unwindPath(term.parentId)}</Text>
                </View>
            </Touchable>
        )
    }

    private renderSectionHeader = (info: { section: SearchSection }) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{info.section.title}</Text>
            </View>
        )
    }

    private handleItemClick = (term: ResultTerm) => {
        let termKeys = term.id.split("/").filter(key => key)

        const sport = termKeys[0]
        const region = termKeys.length > 1 ? termKeys[1] : "all"
        const league = termKeys.length > 2 ? termKeys[2] : "all"
        const participant = termKeys.length > 3 ? termKeys[3] : "all"

        let action = NavigationActions.reset({
                index: 0,
                key: null,
                actions: [
                    NavigationActions.navigate({
                        routeName: 'Spring',
                        params: {sport, region, league, participant, title: term.localizedName}
                    })
                ]
            }
        );
        this.props.navigation.navigate("Sport", {}, action)
    }

    private unwindPath = (id: string, path: string = ""): string => {
        const result = this.props.result;
        if (id && result) {
            if (id.endsWith("/all")) {
                return this.unwindPath(id.replace("/all", ""), path)


            }
            let term = result.resultTerms.find(t => t.id === id);
            if (term) {
                path = path ? term.localizedName + ", " + path : term.localizedName
                return this.unwindPath(term.parentId, path)
            }
        }

        return path
    }


}

const styles = StyleSheet.create({
    header: {
        padding: 8,
        height: 44,
        backgroundColor: "white",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    } as ViewStyle,
    headerText: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
        flex: 1
    } as TextStyle,
    item: {
        padding: 8,
        backgroundColor: "#F6F6F6",
        borderBottomColor: "#D1D1D1",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        height: 44,
    } as ViewStyle,
    itemTitle: {
        marginLeft: 8,
        fontSize: 16,
        color: "#202020",
        fontWeight: "bold"
    } as TextStyle,
    itemSubtitle: {
        marginLeft: 8,
        fontSize: 14,
        color: "#717171",
    } as TextStyle
})

// Connect redux
const mapStateToProps = (state: AppStore, inputProps: ExternalProps): StateProps => ({
    loading: state.searchStore.loading.has(inputProps.searchText),
    result: state.searchStore.searchResult.get(inputProps.searchText)
})
const mapDispatchToProps = (dispatch: Dispatch<any>, inputProps: ExternalProps): DispatchProps => ({
    search: () => dispatch(search(inputProps.searchText))
})

export const SearchView: ComponentClass<ExternalProps> =
    connect<StateProps, DispatchProps, ExternalProps>(mapStateToProps, mapDispatchToProps)(SearchComponent)

