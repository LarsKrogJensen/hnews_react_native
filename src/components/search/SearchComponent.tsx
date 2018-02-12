import * as React from "react"
import {Text, View, ViewStyle} from "react-native";
import {SearchResult} from "api/typings";

interface Props {
    result: SearchResult
    searchText: string
    style: ViewStyle
}

export class SearchComponent extends React.Component<Props> {

    public render() {
        const {searchText, style, result} = this.props
        return (
            <View style={style}>
                <Text>{searchText} result {JSON.stringify(result)}</Text>
            </View>
        )
    }
}