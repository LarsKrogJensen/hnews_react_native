import * as React from 'react';
import {Animated, ViewStyle} from 'react-native';
import {Component} from "react";

interface Props {
    visible: boolean
    duration?: number
    removeWhenHidden?: boolean
    noAnimation?: boolean
    style?: ViewStyle
}

interface State {
    animation: Animated.Value
}

export class HideableView extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(this.props.visible ? 50 : 0)
        }
    }

    animate(show) {
        const duration = this.props.duration ? this.props.duration : 500;
        Animated.timing(
            this.state.animation, {
                toValue: show ? 50 : 0,
                duration: !this.props.noAnimation ? duration : 0
            }
        ).start();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.visible !== nextProps.visible;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.visible !== nextProps.visible) {
            this.animate(nextProps.visible);
        }
    }

    render() {
        if (this.props.removeWhenHidden && !this.props.visible) {
            return null;
        }

        return (
            <Animated.View style={[this.props.style, {height: this.state.animation}]}>
                {this.props.children}
            </Animated.View>
        )
    }
}
