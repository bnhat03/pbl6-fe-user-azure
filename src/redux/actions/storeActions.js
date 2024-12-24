import types from "../types";
import { fetchAllStoresService, fetchStoreByIdService } from "../../services/storeService";

// Thunk: fetching data
export const fetchStoresSuccess = (data) => {
    return {
        type: types.FETCH_STORE_SUCCESS,
        dataStores: data
    };
};

const fetchAllStores = () => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchAllStoresService();
            const data = res && res.data ? res.data.data : [];
            dispatch(fetchStoresSuccess(data));// Chạy ở đây (2)
        } catch (error) {
            console.log(error);
        }
    }
};

// by idStore => Store Detail
const fetchStoreByIdSuccess = (data) => {
    return {
        type: types.FETCH_STORE_BY_ID_SUCCESS,
        storeDetail: data
    };
};
const fetchStoreById = (id) => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchStoreByIdService(id);
            const data = res && res.data ? res.data.data : {};
            dispatch(fetchStoreByIdSuccess(data));
            // console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
};

export {
    fetchAllStores,
    fetchStoreById,

}