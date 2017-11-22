import * as React from "react"
import {NavigationScreenProp} from "react-navigation";
import {Image, ListRenderItemInfo, SectionList, SectionListData, StyleSheet, Text, View} from "react-native";
import banner from "images/banner";
import autobind from "autobind-decorator";
import Touchable from "components/Touchable";
import absoluteFill = StyleSheet.absoluteFill;

interface DrawerProps {
    navigation: NavigationScreenProp<{}, {}>
}

interface Item {
    name: string
    category?: string
    count?: number
    live?: boolean
    path: string
}

export default class Drawer extends React.Component<DrawerProps> {


    render() {
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
                data: [
                    {name: "Champions League", category: "Football", count: 2344, path: "Event"},
                    {name: "SHL", category: "Ice Hockey", count: 793, path: "Event"},
                    {name: "Serie A", category: "Football / Italy", count: 1163, path: "Event"},
                    {name: "Bundesliga", category: "Football / Germany", count: 1153, path: "Event"}
                ]
            },
            {
                title: "Sports",
                data: [
                    {name: "Football", path: "Event"},
                    {name: "Ice Hockey", path: "Event"},
                    {name: "Tennis", path: "Event"},
                    {name: "Basketball", path: "Event"},
                    {name: "Handboll", path: "Event"},
                    {name: "Winter Sports", path: "Event"}
                ]
            },
            {
                title: "More Sports",
                data: [
                    {name: "Badminton", path: "Event"},
                    {name: "Baseball", path: "Event"},
                    {name: "Boxing", path: "Event"},
                    {name: "Chess", path: "Event"},
                    {name: "Cricket", path: "Event"},
                    {name: "Curling", path: "Event"}
                ]
            }
        ]
        return (
            <View style={{backgroundColor: "#333333", flexDirection: "column"}}>
                <View style={{height: 100, justifyContent: "center", alignItems: "center"}}>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Text style={{color: "white", fontSize: 24, fontWeight: "bold"}}>PLAY</Text>
                </View>
                <SectionList
                    stickySectionHeadersEnabled={true}
                    sections={sections}
                    renderSectionHeader={this.renderSectionHeader}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderItem}
                />
            </View>
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
                paddingBottom: 8,
                marginTop: 4
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
