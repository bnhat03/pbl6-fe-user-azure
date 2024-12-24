export const FETCH_UPDATE = 'FETCH_UPDATE';
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS';
export const UPDATE_ALL_USER_STATUS = 'UPDATE_ALL_USER_STATUS';
export const UPDATE_USER_UNREAD = 'UPDATE_USER_UNREAD';
export const UPDATE_ALL_USER_UNREAD = 'UPDATE_ALL_USER_UNREAD';

export const fetchUpdate = (data) => ({
  type: FETCH_UPDATE,
  payload: data
});

// Action creator để cập nhật trạng thái online của người dùng
export const updateUserStatus = (userId, status) => ({
    type: UPDATE_USER_STATUS,
    payload: { userId, status }
});

export const updateAllUserStatus = (usersIds) => ({
    type: UPDATE_ALL_USER_STATUS,
    payload: usersIds
});

export const updateUserIsRead = (userId, status) => ({
  type: UPDATE_USER_UNREAD,
  payload: { userId, status }
});

export const updateAllUserIsRead = (usersIds) => ({
  type: UPDATE_ALL_USER_UNREAD,
  payload: usersIds
});