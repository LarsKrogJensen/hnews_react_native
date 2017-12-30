import React, {PureComponent} from 'react';
import {
    Animated, Button, Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StatusBar, StyleSheet,
    Text, TouchableWithoutFeedback, View
} from 'react-native';
// import {NavigationState, Route} from 'react-native-tab-view';
import Ionicons from "react-native-vector-icons/Ionicons";
import banner from "images/banner";
import {TabViewAnimated} from "react-native-tab-view";
import {Toolbar} from "react-native-material-ui";
import autobind from "autobind-decorator";
import {NavigationScreenProp} from "react-navigation";
import * as Animatable from "react-native-animatable"
import absoluteFill = StyleSheet.absoluteFill;

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

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
    icon: string
}

interface State {
    headerVisible: boolean
    index: number
    routes: Route[]
}

export class TopBarDemo2 extends PureComponent<Props, State> {
    static title = 'No animation';
    static backgroundColor = '#f4f4f4';
    static tintColor = '#222';
    static appbarElevation = 4;
    state = {
        headerVisible: true,
        index: 0,
        routes: [
            {key: '1', title: 'Featured', icon: 'ios-star'},
            {key: '2', title: 'Playlists', icon: 'ios-albums'},
            {key: '3', title: 'Near Me', icon: 'ios-navigate'},
            {key: '4', title: 'Search', icon: 'ios-search'},
            {key: '5', title: 'Updates', icon: 'ios-download'}
        ]
    };

    private animate: any
    private visible: boolean = true
    private y: number = 0;

    _handleIndexChange = index =>
        this.setState({
            index
        });

    _renderLabel = ({position, navigationState}) => ({route, index}) => {
        const inputRange = navigationState.routes.map((x, i) => i);
        const outputRange = inputRange.map(
            inputIndex => (inputIndex === index ? '#2196f3' : '#939393')
        );
        const color = position.interpolate({
            inputRange,
            outputRange
        });
        return (
            <Animated.Text style={[styles.label, {color}]}>
                {route.title}
            </Animated.Text>
        );
    };

    _renderIcon = ({navigationState, position}) => ({route, index}) => {
        const inputRange = navigationState.routes.map((x, i) => i);
        const filledOpacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0))
        });
        const outlineOpacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 0 : 1))
        });
        return (
            <View style={styles.iconContainer}>
                <AnimatedIcon
                    name={route.icon}
                    size={26}
                    style={[styles.icon, {opacity: filledOpacity}]}
                />
                <AnimatedIcon
                    name={route.icon + '-outline'}
                    size={26}
                    style={[styles.icon, styles.outline, {opacity: outlineOpacity}]}
                />
            </View>
        );
    };

    _renderFooter = props => (
        <Animatable.View ref={(r) => this.animate = r} style={styles.tabbar}>
            {props.navigationState.routes.map((route, index) => {
                return (
                    <TouchableWithoutFeedback
                        key={route.key}
                        onPress={() => props.jumpToIndex(index)}
                    >
                        <Animated.View style={styles.tab}>
                            {this._renderIcon(props)({route, index})}
                            {this._renderLabel(props)({route, index})}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                );
            })}
        </Animatable.View>
    );

    _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        let y = event.nativeEvent.contentOffset.y;

        const diff = y - this.y
        console.log("diff: " + diff + ", y: " + y)
        if (diff > 64 && this.visible) {
            this.animate.animate("slideOutDown", 500)
            this.visible = false
            this.y = y
        } else if ((diff < -64 || y < 64) && !this.visible) {
            this.animate.animate("slideInUp", 500)
            this.visible = true
            this.y = y
        }


        // console.log("Offset: " + y)
    }

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                const data: string[] = []
                for (let i = 0; i < 1000; i++)
                    data.push("item" + i)
                return (
                    <View style={[styles.page, {backgroundColor: '#E3F4DD'}]}>
                        <Button title="Hide/show"
                                onPress={() => {
                                    this.animate.animate(this.visible ? "slideOutDown" : "slideInUp", 500)
                                    this.visible = !this.visible
                                }}/>
                        <FlatList
                            style={{flex: 1}}
                            key={"flatlistexample"}
                            data={data}
                            keyExtractor={({item}) => item}
                            onScroll={this._onScroll}
                            renderItem={({item}) => <View key={item}><Text>{item}</Text></View>}
                        />
                    </View>
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
            case '4':
                return (
                    <View
                        style={[styles.page, {backgroundColor: '#EDD8B5'}]}
                    />
                );
            case '5':
                return (
                    <View
                        style={[styles.page, {backgroundColor: '#9E9694'}]}
                    />
                );
            default:
                return null;
        }
    };

    render() {
        return (
            <View style={{flexDirection: "column", flex: 1}}>

                <View>
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <StatusBar backgroundColor="transparent" translucent/>
                    <View style={{backgroundColor: "transparent", height: 24}}/>


                    <Toolbar leftElement={this.leftMenuIcon()}
                             onLeftElementPress={this.onLeftClick}
                             centerElement={"Test"}
                             searchable={{
                                 autoFocus: true,
                                 placeholder: 'Search'
                             }}
                    />

                </View>
                <View style={{flex: 1}}>
                    <TabViewAnimated
                        style={styles.container}
                        navigationState={this.state}
                        renderScene={this._renderScene}
                        renderFooter={this._renderFooter}
                        onIndexChange={this._handleIndexChange}
                        animationEnabled
                        swipeEnabled
                        useNativeDriver
                        initialLayout={initialLayout}
                    />

                </View>
            </View>
        );
    }

    @autobind
    private onLeftClick() {
        const {navigation} = this.props;
        navigation.navigate("DrawerOpen")
    }

    @autobind
    private leftMenuIcon() {
        return "menu"
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f4f4f4',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0, 0, 0, .2)',
        paddingTop: 4.5
    },
    iconContainer: {
        height: 26,
        width: 26
    },
    icon: {
        position: 'absolute',
        textAlign: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        color: '#0084ff'
    },
    outline: {
        color: '#939393'
    },
    label: {
        fontSize: 10,
        marginTop: 3,
        marginBottom: 1.5,
        backgroundColor: 'transparent'
    },
    page: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    }
});