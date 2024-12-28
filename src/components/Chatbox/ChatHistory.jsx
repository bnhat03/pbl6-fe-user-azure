import { useEffect, useRef, useState, useContext } from "react";
// import { store } from "../../redux/store";
import { format, parseISO } from 'date-fns';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import './ChatButton.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { updateAllUserStatus, updateUserStatus } from "../../redux/actions/chatStoreAction";
import { findStoreByOwner, GetChatHistory, PostImageChat } from "../../services/chat";
import { flushSync } from 'react-dom';
import ChatContext from '../../context/showChat';


const ChatHistory = (props) => {
    const dispatch = useDispatch();
    const stores = useSelector((state) => state.stores.stores); // Lấy dữ liệu từ Redux store
    const u = useSelector((state) => state.auth.account)
    const { selectedUser, changeUserLocation, setNewMessagesCount, newMessagesCount, product, st, unreadUsers, setUnreadUsers } = props;
    const [chatHistory, setChatHistory] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [ws, setWs] = useState(null);
    // const idU = store.getState()?.user?.account?.id;
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null); // Create ref for file input
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const idU = u.id;
    const [image, setImage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const { owner, setOwner } = useContext(ChatContext);

    // đó ko có giá trị
    const unreadRef = useRef(unreadUsers);
    const storesRef = useRef(stores);
    const newMessagesCountRef = useRef(newMessagesCount);
    const prevselectedUser = useRef(selectedUser);
    const ownerRef = useRef(owner);

    useEffect(() => {
        ownerRef.current = owner;
    }, [owner]);

    useEffect(() => {
        newMessagesCountRef.current = newMessagesCount;
    }, [newMessagesCount]);
    useEffect(() => {
        prevselectedUser.current = selectedUser;
    }, [selectedUser]);
    useEffect(() => {
        storesRef.current = stores;
    }, [stores]);
    useEffect(() => {
        unreadRef.current = unreadUsers;
    }, [unreadUsers]);
    useEffect(() => {
        // console.log("count: ", newMessagesCount);
    }, [newMessagesCount])

    useEffect(() => {
        if (product?.product_id !== 0 && product?.product_id !== undefined) {
            if (ws) {
                const currentTime = new Date().toISOString(); // Get current time in ISO string

                const messagePayload = {
                    sender: st.id,
                    receiver: idU,
                    product_id: product.product_id,
                    price: product.price,
                    message: product.product_name,
                    local_time: currentTime // Add time to payload
                };

                ws.send(JSON.stringify(messagePayload));
                // setInputMessage('');

            }
        }
    }, [product])
    // useEffect (() => {
    //     // UpdateOnlineSQL();
    //     dispatch(updateUserIsRead(selectedUser.id,true));

    // },[selectedUser]);



    // const UpdateOnlineSQL = async () => {
    //     let res = await GetMarkMessagesAsRead(selectedUser.id);
    //     if (res.EC === 0) {
    //         console.log("update as read thanh cong");
    //     }
    // }

    // Scroll to bottom when chatHistory changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    useEffect(() => {
        const urlBE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
        let urlWS = urlBE.split("//")[1];
        // Set up WebSocket connection once
        const socket = new WebSocket(`wss://${urlWS}/ws/chat`);
        socket.onopen = () => {
            // console.log('Connected to the WebSocket server');
            // Send userId information when connected
            socket.send(JSON.stringify({
                type: 'identify',
                userId: idU
            }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            // console.log("Received message: ", message);

            if (message.type === 'online') {
                const { userId, status } = message;
                // console.log(`User ${userId} is ${status ? 'online' : 'offline'}`);
                dispatch(updateUserStatus(userId, status));

            } else if (message.type === 'onlineUsers') {
                setTimeout(() => {
                    dispatch(updateAllUserStatus(message.onlineUsers));
                }, 2000);

            } else if (message.type === 'loadImage') {
                fetchChatHistory();
                setTimeout(() => {
                    if (!unreadRef.current.includes(message.sender)) {
                        unreadRef.current = [...unreadRef.current, message.sender];
                        setUnreadUsers(unreadRef.current);
                        newMessagesCountRef.current += 1;
                        setNewMessagesCount(newMessagesCountRef.current);
                    }
                }, 2000);

            } else if (message.receiver === idU || message.sender === idU) {
                setChatHistory(prevChatHistory => [
                    ...prevChatHistory,
                    message
                ]);
                if (message.receiver === idU) {
                    // console.log("vao day rôiiiiff")
                    if (!unreadRef.current) {
                        unreadRef.current = [];
                    }

                    if (!unreadRef.current.includes(message.sender)) {
                        unreadRef.current = [...unreadRef.current, message.sender];
                        setUnreadUsers(unreadRef.current);
                        newMessagesCountRef.current += 1;
                        setNewMessagesCount(newMessagesCountRef.current);
                    }
                    changeUserLocation(message.sender, storesRef);
                } else if (message.sender === idU) {
                    // console.log("vao day rôiiiiff2")
                    // dispatch(updateUserIsRead(idU,false));
                    changeUserLocation(message.receiver, storesRef);
                }
            }
        };

        socket.onclose = () => {
            // console.log('Disconnected from WebSocket server');
        };

        setWs(socket);

        const handleBeforeUnload = () => {
            socket.close();
        };

        // Đăng ký sự kiện beforeunload để đóng WebSocket khi trang bị đóng
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup function: Hủy sự kiện trước khi component bị unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [idU]);

    useEffect(() => {
        // Fetch chat history when selectedUser changes
        if (selectedUser) {
            fetchChatHistory();
        }
    }, [selectedUser]);


    const fetchChatHistory = async () => {
        const res = await GetChatHistory(prevselectedUser.current.id);
        // console.log("data chathistory: ", res);
        if (res.data.EC === 0) {
            setChatHistory(res.data.DT);
        }
    }

    const sendMessage = () => {
        if (ws && inputMessage.trim() && selectedUser?.id) {
            const currentTime = new Date().toISOString(); // Get current time in ISO string

            const messagePayload = {
                sender: idU,
                receiver: selectedUser.id,
                message: inputMessage,
                local_time: currentTime // Add time to payload
            };

            ws.send(JSON.stringify(messagePayload));
            setInputMessage('');
            // console.log("Owner trước khi includes: ", owner)
            if (owner.includes(selectedUser.id)) {
                // console.log("dava")
                setTimeout(() => {
                    sendData(idU, selectedUser.id, inputMessage);
                }, 2000); // Chờ 2000ms (2 giây)
            }
            // if (loadStores) handleLoadStores();
        }
    };

    const sendData = async (send, receive, question) => {
        try {
            const res = await findStoreByOwner(receive);
            if (res.data.EC === 0) {
                const data = {
                    storeId: res.data.DT,
                    question: question
                };
                try {
                    let urlAI = import.meta.env.VITE_AI_URL || `http://localhost:5000`;
                    const response = await fetch(`${urlAI}/intent-detection`, { // Tự động chat
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const result = await response.json();
                    // const formattedMessage = result.replace(/\n/g, "\n");
                    const formattedMessage = result.replace(/\n/g, "\n");

                    if (result != null) {
                        const currentTime = new Date().toISOString(); // Get current time in ISO string
                        if (ws) {
                            const messagePayload = {
                                sender: receive,
                                receiver: send,
                                message: formattedMessage,
                                local_time: currentTime // Add time to payload
                            };
                            // console.log("meeagePay: ", messagePayload)
                            setTimeout(() => {
                                ws.send(JSON.stringify(messagePayload));
                            }, 2000);
                        }
                    }
                } catch (error) {
                    console.error("Error sending data:", error);
                    return null
                }
            }
        } catch (error) {
            console.error("Looix ", error);
        }


    };
    const handleQuestionClick = (question) => {
        // Gửi tin nhắn tới hệ thống chat (hoặc xử lý theo yêu cầu của bạn)
        sendMessageToChat(question);
    };

    // Giả sử đây là hàm để gửi tin nhắn vào chat
    const sendMessageToChat = (message) => {
        if (ws && inputMessage.trim() && selectedUser?.id) {
            const currentTime = new Date().toISOString(); // Get current time in ISO string

            const messagePayload = {
                sender: idU,
                receiver: selectedUser.id,
                message: message,
                local_time: currentTime // Add time to payload
            };

            ws.send(JSON.stringify(messagePayload));
            setInputMessage('');

            // if (loadStores) handleLoadStores();
        }
    };

    const handleImageUpload = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setImagePreview(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
            // Reset file input value to allow selecting the same file again
            fileInputRef.current.value = '';
        } else {
            setImagePreview("");
            setImage(null);
        }
    }

    const handleImageRemove = () => {
        setImagePreview("");
        setImage(null);
        // Reset file input value to allow selecting the same file again
        fileInputRef.current.value = '';
    }

    const MAX_IMAGE_SIZE_MB = 2; // Giới hạn kích thước ảnh là 2MB

    const sendImageData = async () => {
        if (ws && image) {
            const sender = Number(idU) || 0;
            const receiver = selectedUser.id;
            const isRead = false;

            // Kiểm tra kích thước ảnh
            if (image.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
                alert('Ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 2MB.');
                return; // Dừng lại nếu ảnh quá lớn
            }

            try {
                let res = await PostImageChat(sender, receiver, isRead, image);
                // console.log(res);

                if (res.data.EC === 0) {
                    ws.send(JSON.stringify({
                        type: 'loadImage',
                        sender: sender,
                        receiver: receiver
                    }));
                } else {
                    alert('Ảnh quá lớn. Vui lòng chọn ảnh có kích thước nhỏ hơn 2MB.');
                }
            } catch (exception) {
                console.error('Error sending image:', exception);
            }
            setImage("");
            setImagePreview("");
            setInputMessage("");
        }
    };


    const formatMessageTime = (time) => {
        if (time) {
            try {
                // Convert ISO string to Date object
                const date = parseISO(time);
                // Format date as needed
                return format(date, 'HH:mm, MMM d, yyyy'); // Example: "21:49, Aug 25, 2024"
            } catch (error) {
                console.error('Error parsing date:', error);
                return 'Invalid Date'; // Or other default value
            }
        } else {
            console.error('Time is undefined or null');
            return 'Unknown Time'; // Or other default value
        }
    };
    const buttonStyle = {
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '8px 15px',
        marginRight: '10px',
        cursor: 'pointer',
    };

    return (
        <div className="chat">
            <div className="chat-header clearfix">
                <div className="row">
                    <div className="col-lg-6">
                        {/* <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                            {
                                selectedUser && selectedUser?.avatar ? (
                                    <img src={`data:image/jpeg;base64,${selectedUser.avatar}`} alt="avatar" />
                                ) :
                                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                            }
                        </a> */}
                        <a onClick={(e) => {
                            e.preventDefault(); // Ngăn ngừa hành động mặc định của liên kết
                            // Mở modal thông qua JavaScript nếu cần
                            $('#view_info').modal('show');
                        }} data-toggle="modal" data-target="#view_info">
                            {
                                selectedUser && selectedUser?.avatar ? (
                                    <img src={`data:image/jpeg;base64,${selectedUser.avatar}`} alt="avatar" />
                                ) :
                                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                            }
                        </a>
                        <div className="chat-about">
                            <h6 className="m-b-0" style={{ fontSize: "15px", textTransform: "none", padding: "0px" }}>{selectedUser?.fullName}</h6>
                            <small><i className={`fa fa-circle ${selectedUser?.online === true ? ' online' : ' offline'}`}></i>{selectedUser?.online === true ? "online" : "offline"}</small>
                        </div>
                    </div>
                    <div className="col-lg-6 hidden-sm text-right">
                        {/* Button to trigger the file input */}
                        <button
                            className="btn btn-outline-primary iconImage"
                            onClick={() => fileInputRef.current.click()}
                            aria-label="Upload image"
                        >
                            <i className="fa fa-image" style={{ color: "#e86f1e" }}></i>
                        </button>

                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
            </div>
            <div className="chat-history">
                <ul className="m-b-0">
                    {chatHistory && chatHistory.length > 0 ? (
                        chatHistory.map((item, index) => (
                            <li key={index} className="clearfix">
                                <div
                                    className={`message-data ${item.sender === idU ? 'text-right' : ''}`}
                                >
                                    <span className="message-data-time">{formatMessageTime(item.local_time)}</span>
                                </div>
                                {item.product_id !== undefined && item.product_id !== 0 ? (

                                    <div>
                                        {alert(item.product_id)}
                                        <div className="product-info">
                                            {/* Hiển thị hình ảnh sản phẩm (base64) */}
                                            <img
                                                src={`data:image/jpeg;base64,${item.image}`}
                                                alt={item.message}
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                            />

                                            {/* Hiển thị tên và giá sản phẩm */}
                                            <h3>{item.message}</h3>
                                            <p>Price: ${item.price}</p>
                                        </div>

                                        {/* Hiển thị câu hỏi chào mừng */}
                                        <span>Xin chào! Bạn đang cần hỗ trợ vấn đề gì?</span>

                                        {/* Thêm các câu hỏi có thể nhấn vào */}
                                        <div style={{ marginTop: '10px' }}>
                                            <button
                                                onClick={() => handleQuestionClick('Sản phẩm này có còn không?')}
                                                style={buttonStyle}
                                            >
                                                Sản phẩm này có còn không?
                                            </button>
                                            <button
                                                onClick={() => handleQuestionClick('Giá hiện tại là bao nhiêu?')}
                                                style={buttonStyle}
                                            >
                                                Giá hiện tại là bao nhiêu vậy?
                                            </button>
                                            <button
                                                onClick={() => handleQuestionClick('Hàng này đặt khi nào tới?')}
                                                style={buttonStyle}
                                            >
                                                Hàng này đặt khi nào tới?
                                            </button>
                                        </div>
                                    </div>

                                ) :

                                    item.message ? (
                                        <div
                                            className={`message ${item.sender == idU ? 'other-message float-right' : 'my-message'}`}
                                            style={{ whiteSpace: 'pre-line' }}
                                        >
                                            {/* {console.log("class: ",item.sender)} */}
                                            {item.message}
                                        </div>
                                    ) : item.image ? (
                                        <div
                                            className={`message ${item.sender == idU ? 'other-message float-right' : 'my-message'}`}
                                        >
                                            {/* Hiển thị ảnh */}
                                            <img
                                                src={`data:image/jpeg;base64,${item.image}`} // Nếu ảnh là base64
                                                alt="chat image"
                                                style={{ maxWidth: '200px', height: 'auto', cursor: 'pointer' }}
                                                onClick={() => {
                                                    setIsOpen(true);
                                                    setSelectedImage(`data:image/jpeg;base64,${item.image}`);
                                                }} />
                                        </div>
                                    ) : null}
                            </li>
                        ))
                    ) : (
                        <div className="no-messages">Chat với nhau đi nào 😍😍</div>
                    )}
                    <div ref={chatEndRef} /> {/* Add ref for scrolling */}
                </ul>
            </div>
            <div className="chat-message clearfix">
                <div className="input-group mb-0">
                    <div className="input-group-prepend">
                        <span
                            className="input-group-text"
                            onClick={() => {
                                if (imagePreview) {
                                    sendImageData(); // Gửi dữ liệu ảnh nếu có
                                } else {
                                    sendMessage(); // Gửi tin nhắn văn bản nếu không có ảnh
                                }
                            }}
                        >
                            <i className="fa fa-paper-plane"></i>

                            {/* <i className="fa fa-send"></i> */}
                        </span>
                    </div>
                    <div className="input-container">
                        {!imagePreview ? (
                            <input
                                type="text"
                                className="formcontrol1"
                                placeholder="Enter text here..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (imagePreview) {
                                            sendImageData(); // Gửi dữ liệu ảnh nếu có
                                        } else {
                                            sendMessage(); // Gửi tin nhắn văn bản nếu không có ảnh
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <div className="image-preview-chat">
                                <button className="remove-image" onClick={handleImageRemove}>
                                    <i className="fa fa-times"></i>
                                </button>
                                <img src={imagePreview} alt="Image Preview" className="preview-image" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isOpen && (
                <Lightbox
                    mainSrc={selectedImage}
                    onCloseRequest={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}

export default ChatHistory;
