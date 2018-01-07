import React, {PureComponent} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {TabBar, TabViewAnimated} from "react-native-tab-view";
import {NavigationScreenProp} from "react-navigation";
import Screen from "screens/Screen";


const initialLayout = {
    height: 0,
    width: Dimensions.get('window').width
};

interface Props {
    navigation: NavigationScreenProp<{}, {}>
}

interface Route {
    key: string
    title: string
}

interface State {
    index: number
    routes: Route[]
}

export class TopBarDemo2 extends PureComponent<Props, State> {
    state = {
        index: 0,
        routes: [
            {key: '1', title: 'In-play'},
            {key: '2', title: 'League'},
            {key: '3', title: 'Explore football'},
        ]
    };

    _handleIndexChange = index =>
        this.setState({
            index
        });

    _renderLabel = props => ({route, index}) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        const outputRange = inputRange.map(
            inputIndex => (inputIndex === index ? '#00ADC9' : '#222')
        );
        const color = props.position.interpolate({
            inputRange,
            outputRange,
        });

        return (
            <Animated.Text style={[styles.label, {color}]}>
                {route.title}
            </Animated.Text>
        );
    };


    _renderFooter = props => (
        <TabBar
            {...props}
            pressColor="rgba(255, 64, 129, .5)"
            onTabPress={this._handleIndexChange}
            renderLabel={this._renderLabel(props)}
            indicatorStyle={styles.indicator}
            tabStyle={styles.tab}
            style={styles.tabbar}
        />
    );

    _renderScene = ({ route }) => {
       switch (route.key) {
         case '1':
           return (
               <View style={[styles.page, {backgroundColor: '#E3F4DD'}]}/>
           );
         case '2':
           return (
               <View
                   style={[styles.page, {backgroundColor: '#E6BDC5'}]}
               />
           );
         case '3':
           return (
               <View
                   style={[styles.page, {backgroundColor: '#9DB1B5'}]}
               />
           );
         default:
             return (
                 <View
                     style={[styles.page, {backgroundColor: 'yellow'}]}
                 />
             );
       }
     };

    render() {
        return (
            <Screen title="Tab Test" navigation={this.props.navigation} rootScreen={true}>
                <TabViewAnimated
                    style={[styles.container]}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderFooter={this._renderFooter}
                    onIndexChange={this._handleIndexChange}
                    // useNativeDriver
                    initialLayout={initialLayout}
                />
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicator: {
        backgroundColor: '#00ADC9',
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        margin: 8,
    },
    tabbar: {
        backgroundColor: '#fff',
    },
    tab: {
        opacity: 1,
        flex: 1
    },
    page: {
        backgroundColor: '#f9f9f9',
    },
});