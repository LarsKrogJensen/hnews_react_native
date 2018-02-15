import * as React from "react"
import {ActivityIndicator, Text, View, ViewStyle} from "react-native";
import {SearchComponent} from "components/search/SearchComponent";
import {SearchResult} from "api/typings";
import {API} from "store/API";
import {NavigationScreenProp} from "react-navigation";

interface Props {
    navigation: NavigationScreenProp<{}, {}>
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
        const {searchText, style, navigation} = this.props
        const {loading, result} = this.state
        if (loading) {
            return (
                <View style={style}>
                    <ActivityIndicator style={{marginTop: 8}}/>
                </View>
            )
        }

        if (result && result.resultTerms.length) {
            return (
                <SearchComponent style={style}
                                 navigation={navigation}
                                 searchText={searchText}
                                 result={result}>
                    <Text>{searchText}</Text>
                </SearchComponent>
            )
        }

        if (result && !result.resultTerms.length && searchText) {
            return (
                <View style={style}>
                    <Text style={{fontSize: 14, margin: 8}}>No matches</Text>
                </View>
            )
        }
        return (
            <View style={style}>
                <Text style={{fontSize: 14, margin: 8}}>Start search</Text>
            </View>
        )
    }

    private search = async (text: string) => {
        console.log("Searching: " + text)
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