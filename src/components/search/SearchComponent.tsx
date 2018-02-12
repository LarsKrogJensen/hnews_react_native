import * as React from "react"
import {
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

interface Props {
    result: SearchResult
    searchText: string
    style: ViewStyle
}

interface SearchSection extends SectionListData<ResultTerm> {
    key: string
    title
}

export class SearchComponent extends React.Component<Props> {

    public render() {
        const {searchText, style, result} = this.props

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
            <View style={styles.item}>
                <Text style={styles.itemTitle}>{term.localizedName}</Text>
                <Text style={styles.itemSubtitle}>{this.unwindPath(term.parentId)}</Text>
            </View>
        )
    }

    private renderSectionHeader = (info: { section: SearchSection }) => {
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>{info.section.title}</Text>
            </View>
        )
    }

    private unwindPath = (id: string, path: string = ""): string => {
        if (id) {
            if (id.endsWith("/all")) {
              return this.unwindPath(id.replace("/all", ""), path)
            }
             
            let term = this.props.result.resultTerms.find(t => t.id === id);
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