import {EventGroup, BetOfferCategories, RootGroup} from "api/typings";
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

export enum BetOfferCategoryActions {
    START_LOADING = "BET_OFFERS_CATEGORIES_START_LOADING",
    LOAD_SUCCESS = "BET_OFFERS_CATEGORIES_LOAD_SUCCESS",
    LOAD_FAILED = "BET_OFFERS_CATEGORIES_LOAD_FAILED"
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

export interface PrematchCategoriesStartAction extends DispatchAction<BetOfferCategoryActions.START_LOADING> {
    eventGroupId: number
    categoryName: string
}

export interface PrematchCategoriesFailedAction extends DispatchAction<BetOfferCategoryActions.LOAD_FAILED> {
    eventGroupId: number
    categoryName: string
}

export interface PrematchCategoriesSuccessAction extends DispatchAction<BetOfferCategoryActions.LOAD_SUCCESS> {
    data: BetOfferCategories
    eventGroupId: number
    categoryName: string
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

export function loadBetOfferCategories(eventGroupId: number, categoryName: string, fireStartLoad: boolean = false): ThunkAction<void, AppStore, any> {
    return async (dispatch, getState) => {

        const key = `${categoryName}-${eventGroupId}`
        if (getState().groupStore.betOfferCategories.has(key)) {
            return
        }

        fireStartLoad && dispatch<PrematchCategoriesStartAction>({
            type: BetOfferCategoryActions.START_LOADING,
            eventGroupId,
            categoryName
        })

        // category/selected-live/group/1000093205.json?lang=sv_SE&market=SE&client_id=2&channel_id=1&ncid=1516037476066
        try {
            const timeName = `Fetching categories for group ${eventGroupId} and category'${categoryName}'`
            console.time(timeName)
            const response = await fetch(`${API.host}/offering/api/v2/${API.offering}/category/${categoryName}/group/${eventGroupId}.json?lang=${API.lang}&market=${API.market}`);
            if (response.status === 200) {
                const responseJson = await response.json();
                dispatch<PrematchCategoriesSuccessAction>({
                    type: BetOfferCategoryActions.LOAD_SUCCESS,
                    data: responseJson,
                    eventGroupId,
                    categoryName
                });
            } else {
                console.warn(timeName)
                dispatch<PrematchCategoriesFailedAction>({
                    type: BetOfferCategoryActions.LOAD_FAILED, eventGroupId,
                    categoryName
                })
            }
            console.timeEnd(timeName)
        } catch (error) {
            console.error(error);
            dispatch<PrematchCategoriesFailedAction>({
                type: BetOfferCategoryActions.LOAD_FAILED, eventGroupId,
                categoryName
            })
        }
    };
}
