import React, {Component} from 'react';
import {AppRegistry,} from 'react-native';
import { Client } from 'bugsnag-react-native';

import App from './src';

export default class NativePlayApp extends Component {
    render() {
        return (
            <App/>
        );
    }
}


const bugsnag = new Client();

AppRegistry.registerComponent('HackerNews', () => NativePlayApp);
