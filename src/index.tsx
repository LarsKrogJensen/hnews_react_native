import React from "react"
import {Provider} from "react-redux"
import {store} from "store/store";
import {NavApp} from "app/NavApp";
import {ThemeProvider} from 'react-native-material-ui';

import "lib/console-time-polyfill"
import {NativeModules} from "react-native";

const {UIManager} = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

// theme for material ui component stuff
// TODO: remove third party component set, build components that is needed -> better control
const uiTheme = {
    palette: {
        primaryColor: "#333333",
        accentColor: "#DEF5FA"
    },
    toolbar: {
        container: {
            height: 50,
            backgroundColor: "transparent"
        }
    }
}

console.ignoredYellowBox = [
    'Setting a timer',
    'Remote debugger'
]

export default function AppContainer() {
    return (
        <Provider store={store}>
            <ThemeProvider uiTheme={uiTheme}>
                <NavApp/>
            </ThemeProvider>
        </Provider>
    )
}