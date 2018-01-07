import {EventGroup, RootGroup} from "api/typings";
import {Dispatch} from "redux";

export enum GroupActions {
    START_LOADING = "GROUPS_START_LOADING",
    LOAD_SUCCESS = "GROUPS_LOAD_SUCCESS",
    LOAD_FAILED = "GROUPS_LOAD_FAILED"
}

export enum HighlightActions {
    START_LOADING = "HIGHLIGHTS_START_LOADING",
    LOAD_SUCCESS = "HIGHLIGHTS_LOAD_SUCCESS",
    LOAD_FAILED = "HIGHLIGHTS_LOAD_FAILED"
}

export interface GroupsStartLoadAction {
    type: GroupActions.START_LOADING
}

export interface GroupsLoadSuccessAction {
    type: GroupActions.LOAD_SUCCESS
    data: RootGroup
}

export interface GroupsLoadFailedAction {
    type: GroupActions.LOAD_FAILED
}

export interface HighlightsStartLoadAction {
    type: HighlightActions.START_LOADING
}

export interface HighlightsLoadSuccessAction {
    type: HighlightActions.LOAD_SUCCESS
    data: { groups: EventGroup[] }
}

export interface HighlightsLoadFailedAction {
    type: HighlightActions.LOAD_FAILED
}

export type GroupsLoadAction = GroupsStartLoadAction | GroupsLoadSuccessAction | GroupsLoadFailedAction |
    HighlightsStartLoadAction | HighlightsLoadSuccessAction | HighlightsLoadFailedAction

export function loadGroups(fireStartLoad: boolean = true): Dispatch<GroupsLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: GroupActions.START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/group.json?lang=en_GB&market=GB&client_id=2&ncid=151137859027');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch groups data took " + (end - start) + " ms.")
            dispatch({
                type: GroupActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: GroupActions.LOAD_FAILED})
        }
    };
}

export function loadHighlights(fireStartLoad: boolean = false): Dispatch<GroupsLoadAction> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch({type: HighlightActions.START_LOADING})
        }

        try {
            const start = new Date().getTime();
            const response =
                await fetch('https://e4-api.kambi.com/offering/api/v2/kambiplay/group/highlight.json?lang=en_GB&market=GB&client_id=2&ncid=1511377011148&depth=0');
            const responseJson = await response.json();
            const end = new Date().getTime();
            console.log("Fetch highlights data took " + (end - start) + " ms.")
            dispatch({
                type: HighlightActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch({type: GroupActions.LOAD_FAILED})
        }
    };
}
