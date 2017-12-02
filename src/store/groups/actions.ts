import * as types from "./types"
import {EventGroup, RootGroup} from "api/typings";
import {Dispatch} from "redux";

export interface GroupsStartLoadAction {
    type: types.GROUPS_START_LOADING_TYPE
}

export interface GroupsLoadSuccessAction {
    type: types.GROUPS_LOAD_SUCCESS_TYPE,
    data: RootGroup
}

export interface GroupsLoadFailedAction {
    type: types.GROUPS_LOAD_FAILED_TYPE
}

export interface HighlightsStartLoadAction {
    type: types.HIGHLIGHTS_START_LOADING_TYPE
}

export interface HighlightsLoadSuccessAction {
    type: types.HIGHLIGHTS_LOAD_SUCCESS_TYPE,
    data: { groups: EventGroup[] }
}

export interface HighlightsLoadFailedAction {
    type: types.HIGHLIGHTS_LOAD_FAILED_TYPE
}

export type GroupsLoadAction = GroupsStartLoadAction | GroupsLoadSuccessAction | GroupsLoadFailedAction |
    HighlightsStartLoadAction | HighlightsLoadSuccessAction | HighlightsLoadFailedAction

export function loadGroups(fireStartLoad: boolean = true): Dispatch<GroupsLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: types.GROUPS_START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/group.json?lang=en_GB&market=GB&client_id=2&ncid=151137859027');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch groups data took " + (end - start) + " ms.")
            dispatch({
                type: types.GROUPS_LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.GROUPS_LOAD_FAILED})
        }
    };
}

export function loadHighlights(fireStartLoad: boolean = false): Dispatch<GroupsLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: types.HIGHLIGHTS_START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/group/highlight.json?lang=en_GB&market=GB&client_id=2&ncid=1511377011148&depth=0');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch highlights data took " + (end - start) + " ms.")
            dispatch({
                type: types.HIGHLIGHTS_LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: types.HIGHLIGHTS_LOAD_FAILED})
        }
    };
}
