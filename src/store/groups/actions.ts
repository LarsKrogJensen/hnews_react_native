import {EventGroup, GroupWithCategories, RootGroup} from "api/typings";
import {API} from "store/API";
import {ThunkAction} from "redux-thunk";
import {AppStore} from "store/store";
import {DispatchAction} from "store/DispatchAction";

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

export type GroupsStartAction = DispatchAction<GroupActions.START_LOADING>
export type GroupsFailedAction = DispatchAction<GroupActions.LOAD_FAILED>

export interface GroupsSuccessAction extends DispatchAction<GroupActions.LOAD_SUCCESS> {
    data: RootGroup
}

export type HighlightsStartAction = DispatchAction<HighlightActions.START_LOADING>

export type HighlightsFailedAction = DispatchAction<HighlightActions.LOAD_FAILED>

export interface HighlightsSuccessAction extends DispatchAction<HighlightActions.LOAD_SUCCESS> {
    data: { groups: EventGroup[] }
}

export interface PrematchCategoriesStartAction extends DispatchAction<PrematchCategoryActions.START_LOADING> {
    eventGroupId: number
}

export interface PrematchCategoriesFailedAction extends DispatchAction<PrematchCategoryActions.LOAD_FAILED> {
    eventGroupId: number
}

export interface PrematchCategoriesSuccessAction extends DispatchAction<PrematchCategoryActions.LOAD_SUCCESS> {
    data: GroupWithCategories
    eventGroupId: number
}

export type GroupsLoadAction = GroupsStartAction | GroupsSuccessAction | GroupsFailedAction
export type HighlightsLoadAction = HighlightsStartAction | HighlightsSuccessAction | HighlightsFailedAction
export type PrematchCategoryLoadAction =
    PrematchCategoriesStartAction
    | PrematchCategoriesSuccessAction
    | PrematchCategoriesFailedAction

export function loadGroups(fireStartLoad: boolean = true): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        fireStartLoad && dispatch<GroupsStartAction>({type: GroupActions.START_LOADING})

        try {
            console.time("Fetching groups data")
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/group.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch({
                    type: GroupActions.LOAD_SUCCESS,
                    data: responseJson
                });
            } else {
                console.warn(`Failed to fetch groups status code: ${response.status}`)
                dispatch({type: GroupActions.LOAD_FAILED})
            }
            console.timeEnd("Fetching groups data")
        } catch (error) {
            console.error(error);
            dispatch({type: GroupActions.LOAD_FAILED})
        }
    };
}

export function loadHighlights(fireStartLoad: boolean = false): ThunkAction<void, AppStore, any> {
    return async dispatch => {
        if (fireStartLoad) {
            dispatch<HighlightsStartAction>({type: HighlightActions.START_LOADING})
        }

        try {
            console.time("Fetching highlights")
            const response =
                await fetch(`${API.host}/offering/api/v2/${API.offering}/group/highlight.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<HighlightsSuccessAction>({
                    type: HighlightActions.LOAD_SUCCESS,
                    data: responseJson
                });
            } else {
                console.warn(`Failed to fetch highlights status code: ${response.status}`)
                dispatch<HighlightsFailedAction>({type: HighlightActions.LOAD_FAILED})
            }
            console.timeEnd("Fetching highlights")
        } catch (error) {
            console.error(error);
            dispatch<HighlightsFailedAction>({type: HighlightActions.LOAD_FAILED})
        }
    };
}

export function loadPrematchCategories(eventGroupId: number, fireStartLoad: boolean = false): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {

        if (getState().groupStore.prematchCategories.has((eventGroupId))) {
            return
        }

        fireStartLoad && dispatch<PrematchCategoriesStartAction>({
            type: PrematchCategoryActions.START_LOADING,
            eventGroupId
        })

        try {
            console.time(`Fetching prematch categories for group ${eventGroupId}`)
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/group/${eventGroupId}/category/pre_match_event.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<PrematchCategoriesSuccessAction>({
                    type: PrematchCategoryActions.LOAD_SUCCESS,
                    data: responseJson,
                    eventGroupId
                });
            } else {
                console.warn(`Failed to fetch prematch categories status code: ${response.status}`)
                dispatch<PrematchCategoriesFailedAction>({type: PrematchCategoryActions.LOAD_FAILED, eventGroupId})
            }
            console.timeEnd(`Fetching prematch categories for group ${eventGroupId}`)
        } catch (error) {
            console.error(error);
            dispatch<PrematchCategoriesFailedAction>({type: PrematchCategoryActions.LOAD_FAILED, eventGroupId})
        }
    };
}
