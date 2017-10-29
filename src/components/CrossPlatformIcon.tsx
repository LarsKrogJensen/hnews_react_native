import Icon from 'react-native-vector-icons/Ionicons';
import {isIos} from "lib/device";
import * as React from "react";

interface Props {
    name: string,
    size: number,
    color: string,
    outline: boolean
}

export default class CrossPlatformIcon extends React.PureComponent<Props> {
    private _root: any;

    // noinspection JSUnusedGlobalSymbols
    setNativeProps = (nativeProps) => {
        this._root.setNativeProps(nativeProps);
    }

    public render() {
        const {name, size, color, outline} = this.props
        const ios = isIos()
        let iconName = !ios ? `md-${name}` : `ios-${name}`;
        if (ios && outline) {
            iconName = `${iconName}-outline`;
        }
        return <Icon name={iconName} size={size} color={color} ref={component => this._root = component}/>;
    }
};

