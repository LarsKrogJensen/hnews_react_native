import * as React from "react"
import {ActivityIndicator, Text, View, ViewStyle} from "react-native";
import {SearchComponent} from "components/search/SearchComponent";
import {SearchResult} from "api/typings";
import {API} from "store/API";

interface Props {
    searchText: string
    style: ViewStyle
}

interface State {
    result?: SearchResult,
    loading: boolean
}

export class SearchView extends React.Component<Props, State> {

    state = {
        loading: false,
        result: undefined
    } as State

    componentDidMount() {
        this.search(this.props.searchText)
    }


    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        this.search(nextProps.searchText)
    }

    public render() {
        const {searchText, style} = this.props
        const {loading, result} = this.state
        if (loading) {
            return (
                <View>
                    <ActivityIndicator style={style}/>
                </View>
            )
        }

        if (result && result.resultTerms.length) {
            return (
                <SearchComponent style={style} searchText={searchText} result={result}>
                    <Text>{searchText}</Text>
                </SearchComponent>
            )
        }

        return (
            <View style={style}>
                <Text>No matches</Text>
            </View>
        )
    }

    private search = async (text: string) => {
        if (text.length > 2) {
            try {
                this.setState(prevState => ({loading: true}))
                const response = await fetch(`${API.host}/offering/api/v3/${API.offering}/term/search.json?lang=${API.lang}&market=${API.market}&term=${text}`);

                if (response.status === 200) {
                    const responseJson = await response.json();
                    this.setState(prevState => ({
                        loading: false,
                        result: responseJson
                    }))
                } else {
                    this.setState(prevState => ({
                        loading: false,
                        result: undefined
                    }))
                }
            } catch (error) {
                console.log("Search failed: " + error)
                this.setState(prevState => ({
                    loading: false,
                    result: undefined
                }))
            }
        }
    }
}