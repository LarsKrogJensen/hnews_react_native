import * as React from "react"
import {Dimensions, StyleSheet, View} from "react-native";
import {SceneMap, TabBar, TabViewAnimated} from 'react-native-tab-view';
import {NavigationScreenProp} from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import PlatformIcon from "components/PlatformIcon";

const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
};

const FirstRoute = () => <View style={[styles.container, {backgroundColor: '#ff4081'}]}/>;
const SecondRoute = () => <View style={[styles.container, {backgroundColor: '#673ab7'}]}/>;


interface ExternalProps {
    navigation: NavigationScreenProp<{}, {}>
}

export class TabScreenDemo extends React.Component<ExternalProps> {
    state = {
        index: 0,
        routes: [
            {key: 'first', title: 'First'},
            {key: 'second', title: 'Second'}
        ]
    };

    private _renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute
    });


    _renderIcon = ({route}) => (
        <PlatformIcon name="home" size={24} color="white"/>
    );

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props => (
        <TabBar {...props}
                indicatorStyle={styles.indicator}
                renderIcon={this._renderIcon}
                style={styles.tabbar}/>
    )


    render() {
        return (
            <TabViewAnimated
                style={styles.container}
                navigationState={this.state}
                renderScene={this._renderScene}
                renderFooter={this._renderHeader}
                onIndexChange={this._handleIndexChange}
                initialLayout={initialLayout}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabbar: {
        backgroundColor: 'white'
    },
    indicator: {
        backgroundColor: 'black'
    }
});