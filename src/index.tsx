import React from "react"
import {compose, createStore} from "redux"
import {Provider} from "react-redux"

import Counter from "containers/Counter"
import rootReducer from "store"

const store = compose()(createStore)(rootReducer)

export default function AppContainer() {
    return (
        <Provider store={store}>
            <Counter color={1}/>
        </Provider>
    )
}