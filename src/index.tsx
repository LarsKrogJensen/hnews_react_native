import React from "react"
import {Provider} from "react-redux"
import store from "store/store";
import NavApp from "app/NavApp";
import {ThemeProvider} from 'react-native-material-ui';

import "lib/console-time-polyfill"

// you can set your style right here, it'll be propagated to application
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
};

console.ignoredYellowBox = [
    'Setting a timer'
];
// __DEV__ = false


export default function AppContainer() {
    return (
        <Provider store={store}>
            <ThemeProvider uiTheme={uiTheme}>
                <NavApp/>
            </ThemeProvider>
        </Provider>
    )
}