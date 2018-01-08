import {EventGroup, GroupWithCategories, RootGroup} from "api/typings";
import {API} from "store/API";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";

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

export enum PrematchCategoryActions {
    START_LOADING = "PREMATCH_CATEGORIES_START_LOADING",
    LOAD_SUCCESS = "PREMATCH_CATEGORIES_LOAD_SUCCESS",
    LOAD_FAILED = "PREMATCH_CATEGORIES_LOAD_FAILED"
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

export interface PrematchCategoriesStartLoadAction {
    type: PrematchCategoryActions.START_LOADING
    eventGroupId: number
}

export interface PrematchCategoriesLoadSuccessAction {
    type: PrematchCategoryActions.LOAD_SUCCESS
    data: GroupWithCategories
    eventGroupId: number
}

export interface PrematchCategoriesLoadFailedAction {
    type: PrematchCategoryActions.LOAD_FAILED
    eventGroupId: number
}

export type GroupsLoadAction = GroupsStartLoadAction | GroupsLoadSuccessAction | GroupsLoadFailedAction
export type HighlightsLoadAction = HighlightsStartLoadAction | HighlightsLoadSuccessAction | HighlightsLoadFailedAction
export type PrematchCategoryLoadAction =
    PrematchCategoriesStartLoadAction
    | PrematchCategoriesLoadSuccessAction
    | PrematchCategoriesLoadFailedAction

export function loadGroups(fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<GroupsStartLoadAction>({type: GroupActions.START_LOADING})

        try {
            console.time("Fetching groups data")
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/group.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd("Fetching groups data")
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

export function loadHighlights(fireStartLoad: boolean = false): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch<HighlightsStartLoadAction>({type: HighlightActions.START_LOADING})
        }

        try {
            console.time("Fetching highlights")
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/group/highlight.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd("Fetching highlights")
            dispatch<HighlightsLoadSuccessAction>({
                type: HighlightActions.LOAD_SUCCESS,
                data: responseJson
            });
        } catch (error) {
            console.error(error);
            dispatch<HighlightsLoadFailedAction>({type: HighlightActions.LOAD_FAILED})
        }
    };
}

export function loadPrematchCategories(eventGroupId: number, fireStartLoad: boolean = false): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {

        if (getState().groupStore.prematchCategories.has((eventGroupId))) {
            return
        }

        fireStartLoad && dispatch<PrematchCategoriesStartLoadAction>({type: PrematchCategoryActions.START_LOADING, eventGroupId})

        try {
            console.time(`Fetching prematch categories for group ${eventGroupId}`)
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/group/${eventGroupId}/category/pre_match_event.json?lang=${API.lang}&market=${API.market}`);
            const responseJson = await response.json();
            console.timeEnd(`Fetching prematch categories for group ${eventGroupId}`)
            dispatch<PrematchCategoriesLoadSuccessAction>({
                type: PrematchCategoryActions.LOAD_SUCCESS,
                data: responseJson,
                eventGroupId
            });
        } catch (error) {
            console.error(error);
            dispatch<PrematchCategoriesLoadFailedAction>({type: PrematchCategoryActions.LOAD_FAILED, eventGroupId})
        }
    };
}
