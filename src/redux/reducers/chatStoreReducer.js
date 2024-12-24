import { FETCH_UPDATE, UPDATE_ALL_USER_STATUS, UPDATE_ALL_USER_UNREAD, UPDATE_USER_STATUS, UPDATE_USER_UNREAD } from "../actions/chatStoreAction";

// src/reducers/storesReducer.js
const initialState = {
  stores: []
};

const chatStoreReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_UPDATE:
      // console.log('check: ', action);
      // Giả sử action.payload.DT là mảng chứa dữ liệu stores mới
      return {
        ...state,
        stores: action.payload.DT // Cập nhật trạng thái stores với dữ liệu mới
      };

    case UPDATE_USER_STATUS:
      // Cập nhật trạng thái online của người dùng
      return {
        ...state,
        stores: state.stores.map(store =>
          store.id === action.payload.userId
            ? { ...store, online: action.payload.status }
            : store
        )
      };
    case UPDATE_ALL_USER_STATUS:
      return {
        ...state,
        stores: state.stores.map(store => {
          // Kiểm tra xem userId có trong mảng payload không
          const isOnline = action.payload.includes(store.id);
          return { ...store, online: isOnline };
        })
      };

    case UPDATE_USER_UNREAD:
      return {
        ...state,
        stores: state.stores.map(store =>
          store.id === action.payload.userId
            ? { ...store, is_read: action.payload.status }
            : store
        )
      }
    case UPDATE_ALL_USER_UNREAD:
      return {
        ...state,
        stores: state.stores.map(store => {
          // Kiểm tra xem userId có trong mảng payload không
          const isRead = action.payload.includes(store.id);
          return { ...store, is_read: isRead };
        })
      }
    default:
      return state;
  }
};

export default chatStoreReducer;
