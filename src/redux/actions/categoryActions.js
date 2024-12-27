import types from "../types";
import { fetchAllCategoriesService } from "../../services/categoryService";
import { fetchAllDrinks } from "./productActions";
// Thunk: fetching data
export const fetchCategoriesRequest = () => {
    return {
        type: types.FETCH_CATEGORY_REQUEST,
    };

};
export const fetchCategoriesSuccess = (data, drinkCategoryId) => {
    return {
        type: types.FETCH_CATEGORY_SUCCESS,
        dataCategories: data,
        drinkCategoryId: drinkCategoryId
    };
};
export const fetchCategoriesError = () => {
    return {
        type: types.FETCH_CATEGORY_ERROR,
    };
};
const fetchAllCategories = () => {
    return async (dispatch, getState) => {
        dispatch(fetchCategoriesRequest());
        try {
            const res = await fetchAllCategoriesService();
            const data = res && res.data ? res.data.data : [];
            // Sau khi lấy all categories -> Tìm cateId có categoryName ==='Drinks'
            const drinkCategoryId = data.find(item => item.categoryName.toLowerCase().includes("đồ uống")).categoryId;
            dispatch(fetchAllDrinks(drinkCategoryId));
            dispatch(fetchCategoriesSuccess(data, drinkCategoryId));

        } catch (error) {
            console.log(error);
            dispatch(fetchCategoriesError());
        }
    }
};
export {
    fetchAllCategories,
}