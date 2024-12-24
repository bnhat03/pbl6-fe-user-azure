import instance from "../setup/instanceAxios"; 

const GetAllStores = () => {
    return instance.get("/api/v1/admin/auth/all");
}

const GetAllStoresChat = () => {
    return instance.get("api/chats/users-chat");
}

const GetChatHistory = (idReceiver) => {
    return instance.get(`api/chats/receiver/${idReceiver}`);
}

const GetUnRead = () => {
    return instance.get(`api/chats/users/unread`);
}

const PutUpdateRead = (userId) => {
    return instance.put(`api/chats/update/read`, null, {
        params: { userId: userId }
    });
}

const searchUsers = (searchTerm) => {
    return instance.get(`api/chats/search/${searchTerm}`);
}

const GetMarkMessagesAsRead = (idSender) => {
    return instance.get(`api/chats/mark-messages-as-read/${idSender}`)
}

const PostImageChat = (sender, receiver, isRead, image) => {
    const data = new FormData();
    data.append('sender', sender);
    data.append('receiver', receiver);
    data.append('isRead', isRead);
    data.append('image', image);
    // console.log("image api: ", image)
    return instance.post('api/chats/saveImage', data);
}

const searchOwnerForStore = (idStore) => {
    return instance.get(`api/chats/searchOwner/${idStore}`);
}

const PostSaveMess = (sender, receiver, isRead, mess) => {
    const data = new FormData();
    data.append('sender', sender);
    data.append('receiver', receiver);
    data.append('isRead', isRead);
    data.append('mess', mess);
    return instance.post('api/chats/saveMessage', data);
}

const GetAllOwner = () => {
    return instance.get(`api/chats/all/owner/store`);
}
const findStoreByOwner = (id) => {
    return instance.get(`api/chats/findStore/${id}`);
}
export {findStoreByOwner,GetAllOwner,PostSaveMess,searchOwnerForStore,searchUsers,PutUpdateRead,PostImageChat,GetUnRead,GetMarkMessagesAsRead, GetAllStoresChat,GetChatHistory,GetAllStores}