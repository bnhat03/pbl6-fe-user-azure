import React, { useState, useEffect, useContext } from 'react'
import './StoreDetail.scss'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreById } from "../../redux/actions/storeActions";
import { fetchProductsByIdStore } from '../../redux/actions/productActions';
import ChatContext from '../../context/showChat';
import { GetAllStoresChat, PostSaveMess, searchOwnerForStore } from '../../services/chat';
import { fetchUpdate } from '../../redux/actions/chatStoreAction';
import VoucherList from '../../components/VoucherList/VoucherList';
import { fetchVouchersByIdStore } from '../../redux/actions/promotionActions';
import { saveVoucher, fetchVouchers } from '../../redux/actions/userActions';
import { toast } from 'react-toastify';

const StoreDetail = () => {
  const { setShowChat, setSelectedUser } = useContext(ChatContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [owner, setOwner] = useState(null);
  const u = useSelector((state) => state.auth.account)
  const idU = u.id;
  const stores = useSelector((state) => state.stores.stores); // Lấy dữ liệu từ Redux store
  const storeDetail = useSelector((state) => {
    return state.store.storeDetail;
  })
  const listProductsByIdStore = useSelector((state) => {
    return state.product.listProductsByIdStore;
  })
  const isLoading = useSelector((state) => state.product.isLoadingListProductsByIdStore);
  const listVouchersStore = useSelector((state) => {
    return state.promotion.listVouchersStore;
  })
  const listVouchersUser = useSelector((state) => {
    return state.user.listVouchersUser;
  })

  // Chat
  const handleClickChatStore = async () => {
    const on = await SearchOwner();
    // console.log("Onn: ",on)
    const index = stores.findIndex(u => u.id === on.id);
    if (index === -1) {
      saveMessage(on.id);
      setTimeout(() => {
        loadStoreAgain();
      }, 1000);

    }
    if (on != null) {
      setSelectedUser(on);
      setShowChat(true);
    }
  }
  const loadStoreAgain = async () => {
    try {
      // console.log("Loading stores again...");
      const previousOnlineUsers = stores
        .filter(user => user.online === true)
        .map(user => user.id);
      const res = await GetAllStoresChat();
      if (res.data.EC === 0 && res.data.DT) {
        const updatedStores = res.data.DT.map(store => ({
          ...store,
          online: previousOnlineUsers.includes(store.id) // Dựa trên danh sách online trước đó
        }));
        dispatch(fetchUpdate({ DT: updatedStores }));
      } else {
        console.error("Lỗi khi tải lại stores:", res);
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện loadStoreAgain:", error);
    }
  };
  const saveMessage = async (idOwner) => {
    const sender = idOwner;
    const receiver = Number(idU);
    const isRead = false;
    const mess = `Xin chào mừng bạn đến với cửa hàng ${storeDetail.storeName},cửa hàng chúng tôi tự hào bán những sản phẩm chất lượng và an toàn. Bạn cần sự giúp đỡ gì từ chúng tôi đây?`;
    try {
      let res = await PostSaveMess(sender, receiver, isRead, mess);
      // console.log(res);
    } catch (exception) {
      console.error('Error sending image:', exception);
    }
  }
  const SearchOwner = async () => {
    const res = await searchOwnerForStore(id);
    // console.log("owner: ", res)
    if (res.data.EC === 0) {
      return res.data.DT;
    }
    return null;
  }

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();  
    const month = date.getMonth() + 1;  
    const year = date.getFullYear();  
    const hours = date.getHours().toString().padStart(2, '0');  
    const minutes = date.getMinutes().toString().padStart(2, '0');  
    // return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
    return `${hours}:${minutes}`;
  };
  const [vouchers, setVouchers] = useState([]);
  const handleSaveVoucher = (voucherId) => {
    if (isAuthenticated) {
      dispatch(saveVoucher(voucherId));
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          +voucher.voucherId === +voucherId ? { ...voucher, userHas: true } : voucher
        )
      );
    }
    else {
      toast.error('Vui lòng đăng nhập');
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchStoreById(id));
    dispatch(fetchProductsByIdStore(id));
    dispatch(fetchVouchersByIdStore(id));
    if (isAuthenticated) {
      dispatch(fetchVouchers()); // list vouchers của user
    }
  }, [id]);
  useEffect(() => {
    const updatedListVouchersStore = listVouchersStore.map(storeVoucher => {
      const userHasVoucher = (Array.isArray(listVouchersUser) ? listVouchersUser : []).some(
        userVoucher => +userVoucher.voucherId === +storeVoucher.voucherId
      );
      if (!userHasVoucher) { // User chưa lưu Voucher => 'Lưu'
        return {
          ...storeVoucher,
          userHas: false
        };
      } 
      return { // User đã lưu Voucher => 'Đã lưu'
        ...storeVoucher,
        userHas: true
      };
    });
    setVouchers(updatedListVouchersStore);
  }, [listVouchersUser, listVouchersStore]);

  if (!storeDetail) {
    return <div>Không có thông tin cửa hàng.</div>;
  }
  else return (
    <div className="page-store-detail">
      <div className="container">
        <div className="store-detail-infor">
          <div className="infor-left">
            {/* <div className="infor-left-img-container">
              <img src={'data:image/png;base64,' + storeDetail.image} alt="" />
            </div> */}
            <div className="infor-left-voucher-container">
              <VoucherList
                vouchers={vouchers} // vouchers: state
                handleSaveVoucher={handleSaveVoucher}
              />
            </div>
            <div className="infor-left-infor-container">
              <div className="infor-left-name">{storeDetail.storeName}</div>
              <div className="infor-left-contact-container">
                <span className="contact-location">
                  <i className="fa-solid fa-compass"></i>
                  {storeDetail.location}
                </span>
                <span className="contact-phone">
                  <i className="fa-solid fa-phone"></i>
                  {storeDetail.numberPhone}
                </span>
                <span className="contact-time">
                  <i className="fa-solid fa-clock"></i>
                  {/* {formatDate(storeDetail.openingTime)} - {formatDate(storeDetail.closingTime)} hàng ngày */}
                  {String(storeDetail?.openingTime || '').slice(0, 5)} - {String(storeDetail?.closingTime || '').slice(0, 5)} hàng ngày
                </span>
                {
                  isAuthenticated === true
                  &&
                  <button onClick={() => handleClickChatStore()} className='chat-store'>Chat với của hàng</button>
                }
              </div>
            </div>
          </div>
          <div className="infor-right">
            <div className="infor-right-ggmap-container">
              {/* <img src={DownloadImage} alt="" /> */}
              <iframe
                // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.842405348711!2d108.14729407579229!3d16.073665739317885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314218d68dff9545%3A0x714561e9f3a7292c!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBCw6FjaCBLaG9hIC0gxJDhuqFpIGjhu41jIMSQw6AgTuG6tW5n!5e0!3m2!1svi!2s!4v1730165637898!5m2!1svi!2s"
                // 2d: longitude => Kinh độ, 3d: latitude => Vĩ độ
                src={`https://www.google.com/maps?q=${storeDetail.latitude},${storeDetail.longitude}&hl=vi&z=18&output=embed`}
                // width="600"
                // height="450"
                style={{ border: 0, width: '100%', height: '82vh' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

            </div>
          </div>
        </div>
        <div className="list-products">
          <FoodDisplay listProducts={listProductsByIdStore} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
export default StoreDetail
