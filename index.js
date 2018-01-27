import React, {Component} from 'react';
import {AppRegistry,} from 'react-native';
import { Client } from 'bugsnag-react-native';

import App from './src';

class NativePlayApp extends Component {
    render() {
        return (
            <App/>
        );
    }
}


// const bugsnag = new Client();

AppRegistry.registerComponent('HackerNews', () => NativePlayApp);
