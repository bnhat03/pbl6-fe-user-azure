import types from "../types";
import { fetchAllSizesService } from "../../services/sizeService";

// Thunk: fetching data
export const fetchSizesSuccess = (data) => {
    return {
        type: types.FETCH_SIZE_SUCCESS,
        dataSizes: data
    };
};

const fetchAllSizes = () => {
    return async (dispatch, getState) => {
        try {
            const res = await fetchAllSizesService();
            const data = res && res.data ? res.data.data : [];
            dispatch(fetchSizesSuccess(data)); // // Chạy ở đây (2)
        } catch (error) {
            console.log(error);
        }
    }
};
export {
    fetchAllSizes,

}