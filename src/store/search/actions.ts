import {SearchResult} from "api/typings";
import {DispatchAction} from "store/DispatchAction";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {API} from "store/API";

export enum SearchActions {
    START_LOADING = "SEARCH_START_LOADING",
    LOAD_SUCCESS = "SEARCH_LOAD_SUCCESS",
    LOAD_FAILED = "SEARCH_LOAD_FAILED"
}

export interface SearchStartAction extends DispatchAction<SearchActions.START_LOADING> {
    text: string
}

export interface SearchSuccessAction extends DispatchAction<SearchActions.LOAD_SUCCESS> {
    text: string
    data: SearchResult
}

export interface SearchFailedAction extends DispatchAction<SearchActions.LOAD_FAILED> {
    text: string
}

export type SearchAction = SearchStartAction | SearchSuccessAction | SearchFailedAction

export function search(text: string): ThunkAction<void, AppStore, any> {

    return async (dispatch, getState) => {
        if (getState().searchStore.searchResult.has(text)) {
            return
        }

        dispatch<SearchAction>({type: SearchActions.START_LOADING, text})

        try {
            console.time(`Searching  text ${text}`)
            let url = `${API.host}/offering/api/v3/${API.offering}/term/search.json?lang=${API.lang}&market=${API.market}&term=${text}`
            const response = await fetch(url);
            const responseJson = await response.json();
            if (response.status === 200) {
                dispatch<SearchSuccessAction>({
                    type: SearchActions.LOAD_SUCCESS,
                    text,
                    data: responseJson
                });
            } else {
                dispatch<SearchFailedAction>({type: SearchActions.LOAD_FAILED, text})
            }
            console.timeEnd(`Searching  text ${text}`)
        } catch (error) {
            console.error(error);
            dispatch<SearchFailedAction>({type: SearchActions.LOAD_FAILED, text})
        }
    };
}
