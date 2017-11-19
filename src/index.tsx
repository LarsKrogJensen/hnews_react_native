import React from "react"
import {Provider} from "react-redux"
import App from "screens/App";
import store from "store/store";
import NavApp from "screens/NavApp";

export default function AppContainer() {
    return (
        <Provider store={store}>
            <NavApp/>
        </Provider>
    )
}