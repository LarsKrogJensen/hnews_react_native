import * as React from "react"

import {
    Animated, Image, ImageStyle, ListView, ListViewDataSource, Platform, StatusBar, StyleSheet, TextStyle, View,
    ViewStyle
} from 'react-native';

import data from './data';
import banner from "images/banner";
import {Toolbar} from "react-native-material-ui";
import autobind from "autobind-decorator";
import {NavigationScreenProp} from "react-navigation";
import AnimatedDiffClamp = Animated.AnimatedDiffClamp;
import absoluteFill = StyleSheet.absoluteFill;
import {navigateBack, navigateDrawerOpen} from "lib/navigate";

const NAVBAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 24});

const AnimatedListView = Animated.createAnimatedComponent(ListView);

interface State {
    dataSource: ListViewDataSource
    scrollAnim: Animated.Value
    offsetAnim: Animated.Value
    clampedScroll: AnimatedDiffClamp
}

interface Props {
    title: string
    rootScreen?: boolean
    navigation: NavigationScreenProp<{}, {}>
}

export class CollapsableScreen extends React.Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        rootScreen: true,
        title: "Hej Hopp"
    }
    private clampedScrollValue = 0;
    private offsetValue = 0;
    private scrollValue = 0;
    private scrollEndTimer: number;


    constructor(props) {
        super(props);

        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        this.state = {
            dataSource: dataSource.cloneWithRows(data),
            scrollAnim,
            offsetAnim,
            clampedScroll: Animated.diffClamp(
                Animated.add(
                    scrollAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolateLeft: 'clamp',
                    }),
                    offsetAnim,
                ),
                0,
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            ),
        };
    }

    componentDidMount() {
        this.state.scrollAnim.addListener(({value}) => {
            const diff = value - this.scrollValue;
            this.scrollValue = value;
            this.clampedScrollValue = Math.min(
                Math.max(this.clampedScrollValue + diff, 0),
                NAVBAR_HEIGHT - STATUS_BAR_HEIGHT,
            );
        });
        this.state.offsetAnim.addListener(({value}) => {
            this.offsetValue = value;
        });
    }

    componentWillUnmount() {
        this.state.scrollAnim.removeAllListeners();
        this.state.offsetAnim.removeAllListeners();
    }

    render() {
        const {clampedScroll} = this.state;

        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
            extrapolate: 'clamp',
        });
        const navbarOpacity = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.fill}>
                <AnimatedListView
                    contentContainerStyle={styles.contentContainer}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    scrollEventThrottle={1}
                    onMomentumScrollBegin={this.onMomentumScrollBegin}
                    onMomentumScrollEnd={this.onMomentumScrollEnd}
                    onScrollEndDrag={this.onScrollEndDrag}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: this.state.scrollAnim}}}],
                        {useNativeDriver: true},
                    )}
                />

                <Animated.View style={[styles.navbar, {transform: [{translateY: navbarTranslate}]}]}>
                    <StatusBar backgroundColor="transparent" translucent/>
                    {/*<View style={{backgroundColor: "transparent", height: 24}}/>*/}
                    <Image style={absoluteFill}
                           source={{uri: banner}}
                    />
                    <Animated.View style={[styles.toolbar, {opacity: navbarOpacity}]}>
                        <Toolbar leftElement={this.leftMenuIcon()}
                                 onLeftElementPress={this.onLeftClick}
                                 centerElement={this.props.title}
                                 searchable={{
                                     autoFocus: true,
                                     placeholder: 'Search'
                                 }}
                        />
                    </Animated.View>
                </Animated.View>
            </View>
        );
    }

    @autobind
    private onScrollEndDrag() {
        this.scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 250);
    };


    @autobind
    private onMomentumScrollBegin() {
        clearTimeout(this.scrollEndTimer);
    }

    @autobind
    private onMomentumScrollEnd() {
        const toValue = this.scrollValue > NAVBAR_HEIGHT &&
        this.clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
            ? this.offsetValue + NAVBAR_HEIGHT
            : this.offsetValue - NAVBAR_HEIGHT;

        Animated.timing(this.state.offsetAnim, {
            toValue,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    @autobind
    private renderRow(rowData, sectionId, rowId) {
        return (
            <Image key={rowId} style={styles.row} source={{uri: rowData.image}} resizeMode="cover"/>
        )
    }

    @autobind
    private onLeftClick() {
        const {navigation, rootScreen} = this.props;
        if (rootScreen) {
            navigateDrawerOpen(navigation)
        } else {
            navigateBack(navigation)
        }
    }

    @autobind
    private leftMenuIcon() {
        const {rootScreen} = this.props;
        if (rootScreen) {
            return "menu"
        } else {
            return "arrow-back"
        }
    }
}

interface Styles {
    fill: ViewStyle,
    navbar: ViewStyle,
    contentContainer: ViewStyle,
    toolbar: ViewStyle,
    rowText: TextStyle,
    row: ImageStyle
}

const styles: Styles = {
    fill: {
        flex: 1,
    },
    navbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'green',
        borderBottomColor: '#dedede',
        borderBottomWidth: 0,
        height: NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingTop: STATUS_BAR_HEIGHT,
    },
    contentContainer: {
        paddingTop: NAVBAR_HEIGHT,
    },
    toolbar: {
        alignSelf: "stretch"
    },
    row: {
        height: 300,
        width: undefined,
        marginBottom: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
    rowText: {
        color: 'white',
        fontSize: 18,
    },
}
