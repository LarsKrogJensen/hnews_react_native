import React from "react"
import {applyMiddleware, compose, createStore} from "redux"
import {Provider} from "react-redux"
import App from "screens/App";
import store from "store/store";
import {StatusBar, View} from "react-native";

export default function AppContainer() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}