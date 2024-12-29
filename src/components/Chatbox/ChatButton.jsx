import { useEffect, useState, useContext } from 'react';
import './ChatButton.css';
import { useDispatch, useSelector } from "react-redux";
import ChatContent from './ChatContent';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { GetAllOwner, GetAllStoresChat, GetUnRead } from '../../services/chat';
import { fetchUpdate, updateAllUserIsRead } from '../../redux/actions/chatStoreAction';
import ChatContext from '../../context/showChat';

const ChatButton = (props) => {
    const stores = useSelector((state) => state.stores.stores); // Lấy dữ liệu từ Redux store
    const { product } = props;
    const [newMessagesCount, setNewMessagesCount] = useState(0);
    const [unreadUsers, setUnreadUsers] = useState([]);
    const dispatch = useDispatch();
    const {showChat, setShowChat,selectedUser, setSelectedUser,owner,setOwner} = useContext(ChatContext);

    useEffect(() => {
        fetchAllStores();
        GetAllUnRead();
        GetAllIdOwner();
    }, []);

    // useEffect(()=>{
    //     console.log("change new message count: ",newMessagesCount)
    // },[])
    // useEffect(()=>{
    //     console.log("change new message count: ",newMessagesCount)
    // },[newMessagesCount])
    // useEffect(() => {
    //     GetAllUnRead();
    // }, []); 
    // Chạy lại khi stores thay đổi

    const GetAllIdOwner = async() => {
        try {
            const res = await GetAllOwner();
            if (res.data.EC === 0) {
                // console.log("Lấy Owner thành công");
                // console.log("data Owner: ", res);
                // Lấy danh sách người dùng có is_online là false
                setTimeout(() => {
                    setOwner(res.data.DT);
                  }, 1000);
                // console.log("owner tại chathbutton: ",owner)
            } else {
                console.error("Lỗi khi lấy owner:", res);
            }
        } catch (error) {
            console.error("Lỗi khi thực hiện GetAllUnƠner:", error);
        }
    }

    const GetAllUnRead = async () => {
        try {
            const res = await GetUnRead();
            if (res.data.EC === 0) {
                // console.log("Lấy tin nhắn chưa đọc thành công");
                // console.log("data unread: ", res);
                // Lấy danh sách người dùng có is_online là false
                const usersWithUnread = res.data.DT;
                const unreadUserIds = usersWithUnread.map(user => user.id);
                setTimeout(() => {
                    setNewMessagesCount(usersWithUnread.length);
                    setUnreadUsers(unreadUserIds);
                    dispatch(updateAllUserIsRead(usersWithUnread.map(user => user.id)));

                }, 2000);
                //   console.log("new unread chatbutoon: ",unreadUsers);
            } else {
                console.error("Lỗi khi lấy tin nhắn chưa đọc:", res);
            }
        } catch (error) {
            console.error("Lỗi khi thực hiện GetAllUnRead:", error);
        }
    }

    const fetchAllStores = async () => {
        try {
            // console.log("fetchData được gọi"); 
            const res = await GetAllStoresChat();
            // console.log("dl trả về", res.data.DT);
            if (res.data.EC === 0) {
                const updatedStores = res.data.DT.map(store => ({
                    ...store,
                    online: false, // Giá trị mặc định cho thuộc tính `online`
                    is_online: true
                }));
                // console.log("Đang cập nhật stores...");
                // console.log("update store but: ", stores)
                dispatch(fetchUpdate({ DT: updatedStores }));
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu cửa hàng:", error);
        }
    };

    return (
        <div>
            {/* Nút chat */}
            <div className={`chat-button ${showChat ? 'hidden' : 'visible'}`} onClick={() => setShowChat(!showChat)}>
                <button>Chat
                    {newMessagesCount > 0 && (
                        <span className="notification-badge">{newMessagesCount}</span>
                    )}
                </button>
            </div>

            {/* ChatContent luôn tồn tại trong DOM nhưng được ẩn */}
            <div className={`chat-content ${showChat ? 'visible' : 'hidden'}`}>
                <ChatContent
                    showChat={showChat}
                    setShowChat={setShowChat}
                    setNewMessagesCount={setNewMessagesCount}
                    newMessagesCount={newMessagesCount}
                    product={product}
                    unreadUsers={unreadUsers}
                    setUnreadUsers={setUnreadUsers}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </div>
        </div>
    )
};

export default ChatButton;