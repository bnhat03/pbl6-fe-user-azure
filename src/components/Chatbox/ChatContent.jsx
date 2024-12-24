import { useRef, useCallback, useEffect, useState, useContext } from 'react';
import ChatHistory from './ChatHistory';
import { useDispatch, useSelector } from "react-redux";
import './ChatButton.css';
import { GetAllStoresChat, PutUpdateRead, searchUsers } from '../../services/chat';
import { fetchUpdate } from '../../redux/actions/chatStoreAction';
import ChatContext from '../../context/showChat';


const ChatContent = (props) => {
    const stores = useSelector((state) => state.stores.stores); // Lấy dữ liệu từ Redux store
    const { setNewMessagesCount, newMessagesCount, setShowChat, product, st, unreadUsers, setUnreadUsers,selectedUser, setSelectedUser,onwer } = props;
    const [searchTerm, setSearchTerm] = useState("");
    const [search, setSearch] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadStores, setLoadStores] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const searchRef = useRef(null);  // Tạo ref cho ô input
    const dispatch = useDispatch();
    const [rederKey, setRenderKey] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            if (stores && stores.length > 0) {
                setSelectedUser(stores[0]);
            }
        }, 1000);
        return () => clearTimeout(timer);

    }, [stores]);
    useEffect(() => {
        // Khi selectedUser thay đổi, bạn có thể cập nhật một trạng thái khác để buộc render lại
        setRenderKey(prevKey => prevKey + 1);  // Cập nhật một trạng thái để render lại
    }, [selectedUser]);
    // const fetchAllStoress = async () => {
    //     let res = await GetAllStoresChat();
    //     if (res.EC === 0) {
    //         // Thêm thuộc tính `online` vào từng đối tượng
    //         const updatedStores = res.DT.map(store => ({
    //             ...store,
    //             online: false // Giá trị mặc định cho thuộc tính `online`
    //         }));
    //         dispatch(fetchUpdate({ DT: updatedStores }));
    //     }
    // };

    useEffect(() => {
        // console.log("stores thay ddoi: ", stores)
    }, [stores])

    useEffect(() => {
        // console.log("store o conten: ", stores)
    }, [])

    useEffect(() => {
        if (st !== null && st !== undefined) {
            alert(st)
            setSelectedUser(st);
        }
    }, [st])
    // useEffect (() => {
    //     if (stores.length>0){
    //         setSelectedUser(stores[0]);
    //     }
    // },[showChat])

    // useEffect(() => {
    //     console.log("Load lại stores");
    //     fetchAllStores();
    // }, [stores.length]);


    const handleClickChatContent = () => {
        setShowChat(false);
    };

    const changeUserLocation = (idReceiver, storesRef) => {
        // console.log("stores change: ", storesRef.current);

        // Tìm kiếm người dùng trong storesRef
        const index = storesRef.current.findIndex(u => u.id === idReceiver);

        if (index !== -1) {
            const selectU = storesRef.current[index];
            const newStores = [selectU, ...storesRef.current.slice(0, index), ...storesRef.current.slice(index + 1)];

            storesRef.current = newStores;
            dispatch(fetchUpdate({ DT: newStores }));  // Cập nhật lại stores qua Redux
        } else {
            loadStoreAgain(idReceiver, storesRef);
            // console.log('Không tìm thấy người dùng');
        }
    };


    const updateOnlineStore = (storesRef, isOnlineRef) => {
        const currentStores = storesRef.current;  // Lấy giá trị mới nhất từ storesRef
        const ion = isOnlineRef.current;     // Lấy giá trị mới nhất từ isOnlineRef

        // console.log("Danh sách đang online: ", ion);

        // Cập nhật trạng thái `online` của các stores dựa trên danh sách `isOnline`
        const updatedStores = currentStores.map(store => ({
            ...store,
            online: ion.includes(store.id)
        }));

        dispatch(fetchUpdate({ DT: updatedStores }));
        // console.log("Danh sách stores cập nhật: ", updatedStores);
    };
    //
    const handleClickUser = (user) => {
        setSelectedUser(user);
        if (unreadUsers.includes(user.id)) {
            setNewMessagesCount(newMessagesCount - 1);
            setUnreadUsers((prevUnreadUsers) => {
                return prevUnreadUsers.filter(unreadUser => unreadUser !== user.id);
            });
            updateRead(user.id);
        }

    }

    const updateRead = async (userId) => {
        try {
            const response = await PutUpdateRead(userId);

            if (response.data.EC === 0) {
                // console.log('Update successful:', response.data);
            }
        } catch (error) {
            console.error('Error updating read status:', error);
        }
    }

    const handleChangeInput = useCallback((e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term === "") {
            // When searchTerm is empty, set filteredUsers to all users
            setFilteredUsers(stores);
        } else {
            // Filter users based on searchTerm
            setFilteredUsers(users.filter(user =>
                user.fullName.toLowerCase().includes(term.toLowerCase())
            ));
        }
    }, [users]);


    const loadStoreAgain = async (idReceiver, storesRef) => {
        try {
            // console.log("Loading stores again...");

            const previousOnlineUsers = storesRef.current
                .filter(user => user.online === true)
                .map(user => user.id)
                .concat(idReceiver);

            const res = await GetAllStoresChat();

            if (res.data.EC === 0 && res.data.DT) {
                const updatedStores = res.data.DT.map(store => ({
                    ...store,
                    online: previousOnlineUsers.includes(store.id) // Dựa trên danh sách online trước đó
                }));

                storesRef.current = updatedStores;
                dispatch(fetchUpdate({ DT: updatedStores }));
            } else {
                console.error("Lỗi khi tải lại stores:", res);
            }
        } catch (error) {
            console.error("Lỗi khi thực hiện loadStoreAgain:", error);
        }
    };

    // xem lại ở đây
    const handleClickNewUser = (user) => {
        setSelectedUser(user);
        const exists = users.some(u => u.id === user.id && u.fullName === user.fullName);
        if (!exists) setLoadStores(true);
        setSearch(false);
        setSearchTerm('');
    }

    const handleClickSearch = async () => {
        if (searchTerm !== '') {
            // console.log("Loading stores again...");
            const res = await searchUsers(searchTerm);
            if (res.data.EC === 0) {
                // console.log("data user: ", res.data.DT)
                setUsers(res.data.DT);
                setFilteredUsers(res.data.DT);
            }
        }
    }
    const handleClickOutside = useCallback((e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setSearch(false);  // Đóng danh sách tìm kiếm khi nhấp chuột ra ngoài
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="container-chat">
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card chat-app">
                        <button className="chat-close" onClick={handleClickChatContent}>X</button>
                        <div id="plist" className="people-list">
                            <div className="input-group" ref={searchRef}>
                                <div className="input-group-prepend">
                                    <span className="input-group-text"
                                        onClick={handleClickSearch}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                // e.stopPropagation();
                                                handleClickSearch()
                                            }
                                        }}
                                        tabIndex="0"

                                    ><i className="fa fa-search"></i></span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    style={{ outline: "none" }}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={() => {
                                        setSearchTerm("")
                                        setSearch(true)
                                    }
                                    }
                                />
                            </div>
                            <ul key={rederKey} className="list-unstyled chat-list mt-2 mb-0">
                                {search === false && stores && stores.length > 0 &&
                                    stores.map((item, index) => (
                                        <li key={index}
                                            className={`clearfix ${selectedUser === item ? 'selected' : ''}  ${unreadUsers.includes(item.id) ? 'unread' : ''}`}
                                            onClick={() => handleClickUser(item)}>
                                            {
                                                item.avatar ? (
                                                    <img src={`data:image/jpeg;base64,${item.avatar}`} alt="avatar" />
                                                ) :
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                            }
                                            <div className="about">
                                                <div className="name">{item.fullName}</div>
                                                <div className="status"> <i className={`fa fa-circle ${item.online === true ? 'online' : 'offline'}`}></i> {item.online === true ? "online" : "offline"} </div>
                                            </div>
                                        </li>
                                    ))
                                }
                                {search === true && filteredUsers && filteredUsers.length > 0 && filteredUsers.map((item, index) => (
                                    <li key={index} className="clearfix" onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickNewUser(item)
                                    }
                                    }
                                    >
                                        {
                                            item.avatar ? (
                                                <img src={`data:image/jpeg;base64,${item.avatar}`} alt="avatar" />
                                            ) :
                                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                        }
                                        <div className="about">
                                            <div className="name">{item.fullName}</div>
                                            <small><i className={`fa fa-circle ${selectedUser.online === true ? ' online' : ' offline'}`}></i></small>

                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <ChatHistory
                            selectedUser={selectedUser}
                            changeUserLocation={changeUserLocation}
                            setNewMessagesCount={setNewMessagesCount}
                            newMessagesCount={newMessagesCount}
                            updateOnlineStore={updateOnlineStore}
                            product={product}
                            st={st}
                            unreadUsers={unreadUsers}
                            setUnreadUsers={setUnreadUsers}
                            onwer= {onwer}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContent;
