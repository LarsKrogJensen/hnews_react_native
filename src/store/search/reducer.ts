import {Map, Set} from "immutable"
import {SearchResult} from "api/typings";
import {SearchAction, SearchActions} from "store/search/actions";

export interface SearchStore {
    loading: Set<string>
    searchResult: Map<string, SearchResult>
}

const initialState: SearchStore = {
    loading: Set(),
    searchResult: Map()
}

export function searchReducer(state: SearchStore = initialState, action: SearchAction): SearchStore {
    switch (action.type) {
        case SearchActions.START_LOADING:
            return {
                ...state,
                loading: state.loading.add(action.text)
            }
        case SearchActions.LOAD_SUCCESS:
            return {
                ...state,
                loading: state.loading.remove(action.text),
                searchResult: state.searchResult.set(action.text, action.data)
            }
        case SearchActions.LOAD_FAILED:
            return {
                ...state,
                loading: state.loading.remove(action.text)
            }
        default:
            return state
    }
}
