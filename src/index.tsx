import React from "react"
import {Provider} from "react-redux"
import App from "app/App";
import store from "store/store";
import NavApp from "app/NavApp";

export default function AppContainer() {
    return (
        <Provider store={store}>
            <NavApp/>
        </Provider>
    )
}