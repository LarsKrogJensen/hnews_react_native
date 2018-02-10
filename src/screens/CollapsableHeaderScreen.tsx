import * as React from "react"
import {ReactNode} from "react"

import {
    Animated,
    ImageStyle,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    StatusBar,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import banner from "images/banner";
import {Toolbar} from "react-native-material-ui";
import {NavigationScreenProp} from "react-navigation";
import {navigateBack, navigateDrawerOpen} from "lib/navigate";
import AnimatedDiffClamp = Animated.AnimatedDiffClamp;
import absoluteFill = StyleSheet.absoluteFill;

export const NAVBAR_HEIGHT = 64;
export const STATUS_BAR_HEIGHT = Platform.select({ios: 20, android: 24});

interface State {
    scrollAnim: Animated.Value
    offsetAnim: Animated.Value
    clampedScroll: AnimatedDiffClamp
}

interface Props {
    title: string
    rootScreen?: boolean
    navigation: NavigationScreenProp<{}, {}>
    renderBody: (scrollHooks: ScrollHooks) => ReactNode
}

export interface ScrollHooks {
    onMomentumScrollBegin: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onMomentumScrollEnd: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScrollEndDrag: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onScroll: (event?: NativeSyntheticEvent<NativeScrollEvent>) => void;
    contentContainerStyle: ViewStyle,
    scrollEventThrottle: number
}

export class CollapsableHeaderScreen extends React.Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        rootScreen: true,
        title: "Title"
    }
    private clampedScrollValue = 0;
    private offsetValue = 0;
    private scrollValue = 0;
    private scrollEndTimer: number;
    private statusBarHidden: boolean = false


    constructor(props) {
        super(props);

        const scrollAnim = new Animated.Value(0);
        const offsetAnim = new Animated.Value(0);

        this.state = {
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

            // console.log("Clamped: " + this.clampedScrollValue + ", Scroll value: " + this.scrollValue + ", Offset: " + this.offsetValue)
            if (this.clampedScrollValue > 5 && !this.statusBarHidden && this.scrollValue > STATUS_BAR_HEIGHT) {
                StatusBar.setHidden(true, "slide")
                this.statusBarHidden = true
                // console.log("HIDING at clampValue: " + this.clampedScrollValue)
            } else if (this.clampedScrollValue < 5 && this.statusBarHidden) {
                StatusBar.setHidden(false, "slide")
                this.statusBarHidden = false
                // console.log("SHOWING at clampValue: " + this.clampedScrollValue)
            }
        });
        this.state.offsetAnim.addListener(({value}) => {
            this.offsetValue = value;
            // console.log("Offet anim value: " + value)
        });
    }

    componentWillUnmount() {
        this.state.scrollAnim.removeAllListeners();
        this.state.offsetAnim.removeAllListeners();
    }

    render() {

        const {clampedScroll, scrollAnim} = this.state;

        const navbarTranslate = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [0, -(NAVBAR_HEIGHT - STATUS_BAR_HEIGHT)],
            extrapolate: 'clamp',
        });
        const navbarOpacity: Animated.AnimatedInterpolation = clampedScroll.interpolate({
            inputRange: [0, NAVBAR_HEIGHT - STATUS_BAR_HEIGHT],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        const scrollHooks: ScrollHooks = {
            onMomentumScrollBegin: this.onMomentumScrollBegin,
            onMomentumScrollEnd: this.onMomentumScrollEnd,
            onScrollEndDrag: this.onScrollEndDrag,
            scrollEventThrottle: 16,
            contentContainerStyle: styles.contentContainer,
            onScroll: Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollAnim}}}],
                {useNativeDriver: true},
            )
        }
        return (
            <View style={styles.fill}>
                {this.props.renderBody(scrollHooks)}
                <Animated.View style={[styles.navbar, {transform: [{translateY: navbarTranslate}]}]}>
                    <StatusBar backgroundColor="transparent" translucent hidden={this.statusBarHidden}/>

                    <Animated.Image style={[absoluteFill, {opacity: navbarOpacity}]}
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

    private onScrollEndDrag = () => {
        this.scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 250);
    };

    private onMomentumScrollBegin = () => {
        clearTimeout(this.scrollEndTimer);
    }

    private onMomentumScrollEnd = () => {
        const toValue = this.scrollValue > NAVBAR_HEIGHT &&
        this.clampedScrollValue > (NAVBAR_HEIGHT - STATUS_BAR_HEIGHT) / 2
            ? this.offsetValue + NAVBAR_HEIGHT
            : this.offsetValue - NAVBAR_HEIGHT;

        Animated.timing(this.state.offsetAnim, {
            toValue,
            duration: 350,
            useNativeDriver: true,
        }).start();
    }

    private onLeftClick = () => {
        const {navigation, rootScreen} = this.props;
        if (rootScreen) {
            navigateDrawerOpen(navigation)
        } else {
            navigateBack(navigation)
        }
    }

    private leftMenuIcon = () => {
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
    // statusbar: ViewStyle,
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
        borderBottomColor: '#dedede',
        borderBottomWidth: 0,
        backgroundColor: "transparent",
        height: NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingTop: STATUS_BAR_HEIGHT,
    },
    // statusbar: {
    //     position: 'absolute',
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     height: STATUS_BAR_HEIGHT
    // },
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
