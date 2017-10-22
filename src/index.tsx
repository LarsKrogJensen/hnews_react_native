import React from "react"
import {compose, createStore} from "redux"
import {Provider} from "react-redux"
import rootReducer from "store"
import App from "screens/App";

const store = compose()(createStore)(rootReducer)

export default function AppContainer() {
    return (
        <Provider store={store}>
            <App/>
        </Provider>
    )
}