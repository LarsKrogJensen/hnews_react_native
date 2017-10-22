import React from "react"
import {applyMiddleware, compose, createStore} from "redux"
import {Provider} from "react-redux"
import App from "screens/App";
import store from "store/store";

export default function AppContainer() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}