import React, { useState, useEffect } from 'react'
import './ComboItemDetail.scss'
import { assets } from '../../assets/assets'
import logoStar from '../../assets/logo/star.png'
import logoStarNobgColor from '../../assets/logo/star_no_bgcolor.png'
import logoUser from '../../assets/logo/user.png'
import StoreList from '../StoreList/StoreList';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComboById, fetchRatingComboById, fetchSimilarCombos } from "../../redux/actions/productActions";
import { fetchAllStores } from "../../redux/actions/storeActions";
import ComboItemModal from '../ComboItemModal/ComboItemModal'
import FoodDisplay from '../FoodDisplay/FoodDisplay'


const ComboItemDetail = () => {
  // Preview image
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const handleImageClick = (image) => {
    setPreviewImage(image);
    setShowImagePreview(true);
  };
  const handleCloseImagePreview = () => {
    setShowImagePreview(false);
    setPreviewImage('');
  };
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
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };
  // Modal
  const [showModalCombo, setShowModalCombo] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleShowModalCombo = () => {
    setShowModalCombo(true); // Hiển thị modal
  };
  const handleCloseModalCombo = () => {
    setShowModalCombo(false); // Đóng modal
    setTimeout(() => {
      setIsAddToCart(false);
    }, 200);
  };
  const handleAddToCartClick = () => {
    setIsAddToCart(true);
    handleShowModalCombo();
  };

  // API
  const { id } = useParams(); // id combo
  const dispatch = useDispatch();
  const comboDetail = useSelector((state) => {
    return state.product.comboDetail;
  })
  const listSimilarCombos = useSelector((state) => {
    return state.product.listSimilarCombos;
  })
  const isLoading = useSelector((state) => state.product.isLoadingListSimilarCombos);
  // Tìm store chứa tất cả product trong combo
  const filterStoresWithAllComboProducts = (combo) => {
    if (!combo || !combo.products || combo.products.length === 0) return [];
    // Tạo một mảng gồm các storeId từ sản phẩm đầu tiên trong combo
    let commonStores = combo.products[0].stores.map(store => store.storeId);
    // Duyệt qua từng product trong combo để tìm các storeId chung của All sản phẩm
    combo.products.forEach((product) => {
      const productStoreIds = product.stores.map(store => store.storeId);
      commonStores = commonStores.filter(storeId => productStoreIds.includes(storeId));
    });
    // Array detail infor của các stores có mặt trong commonStores
    const filteredStores = combo.products[0].stores.filter(store =>
      commonStores.includes(store.storeId)
    );
    return filteredStores; 
  };
  const stores = useSelector((state) => {
    return state.store.listStores;
  })
  const ratingCombo = useSelector((state) => {
    return state.product.ratingCombo;
  })
  const account = useSelector((state) => state.auth.account); // Khách hàng đã đánh giá sản phẩm ni -> Vô coi đánh giá sản phẩm -> hiện "Bạn"
  useEffect(() => {
    dispatch(fetchComboById(id));
    dispatch(fetchAllStores());
    dispatch(fetchSimilarCombos(id));
    dispatch(fetchRatingComboById(id));
    window.scrollTo(0, 0);
  }, [id]);

  // Select -> Lọc số sao ở review
  const [selectedRating, setSelectedRating] = useState("0"); // Lọc số sao sản phẩm, Mặc định là "Tất cả đánh giá"
  const filteredReviews = Array.isArray(ratingCombo) ? ratingCombo.filter(review =>
    selectedRating === "0" || +review.rate === +selectedRating
  ) : [];
  const handleFilterRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  if (!comboDetail) {
    return <div>Không có thông tin combo.</div>;
  }
  else return (
    <div className="page-product-detail">
      <div className="container">
        <div className="product-detail-infor">
          <div className="infor-left">
            <div className="infor-left-img-container">
              <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${comboDetail.image}`} alt="" />
            </div>
          </div>
          <div className="infor-right">
            <div className="infor-right-category">
              <span>COMBO</span>
            </div>

            <div className="infor-right-name">{comboDetail.comboName}</div>
            <div className="infor-right-review">
              <span>
                {comboDetail?.averageRate ? +comboDetail.averageRate.toFixed(1) : "0"} / 5
                <img src={logoStar} alt="" />
              </span>
              <span>({ratingCombo.length} đánh giá)</span>
            </div>
            <hr />
            <div className="infor-right-products">
              <span>&#128073; Danh sách sản phẩm trong combo</span>
              <div className="products-container">
                {
                  comboDetail?.products && comboDetail.products.length > 0 ? (comboDetail.products.map((item, index) => {
                    return (
                      <div className="product-item" key={index}>
                        <div className="product-item-image">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${item.image}`}
                            alt='Ảnh sản phẩm'
                          // onClick={() => handleImageClick('data:image/png;base64,' + item.productDetail.productImage)} // Gọi modal preview
                          />
                        </div>
                        <div className="product-item-infor">
                          <p className="infor-name">{item.productName}</p>
                        </div>
                      </div>
                    )
                  }))
                    : (
                      <div>Không có sản phẩm nào</div>
                    )
                }
              </div>
            </div>
            <hr />
            <div className="infor-right-price-container">
              <span className='title'>&#128073; Giá bán: </span>
              <span className="infor-right-price-discount">
                {Number(comboDetail.price).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="infor-right-description">
              <span>&#128073; Mô tả: {comboDetail.description}</span>
            </div>
            <hr />
            <div className="infor-right-btn-container">
              <button
                className='btn-buynow'
                onClick={handleShowModalCombo}
              >
                MUA NGAY <i className="fa-solid fa-file-invoice-dollar"></i>
              </button>
              <button
                className='btn-addtocart'
                onClick={handleAddToCartClick}
              >
                THÊM VÀO GIỎ HÀNG <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
            <div className="infor-right-store">
              <hr />
              <div className="infor-right-store-title">
                <span>&#128073; Danh sách cửa hàng hiện có</span>
              </div>
              <StoreList stores={filterStoresWithAllComboProducts(comboDetail)} />
            </div>
            <ComboItemModal
              showModalCombo={showModalCombo}
              handleCloseModalCombo={handleCloseModalCombo}
              combo={comboDetail}
              stores={filterStoresWithAllComboProducts(comboDetail)}
              isAddToCart={isAddToCart}
            />
          </div>
        </div>

        <div className="similar-combos-container">
          <h2>DANH SÁCH COMBO KHÁC</h2>
          <FoodDisplay listProducts={listSimilarCombos} isLoading={isLoading} />
        </div>

        <div className="product-detail-comment">
          <h2>Bài viết đánh giá</h2>
          <div className="filter-wrapper">
            <div className="filter-container">
              <select
                className="form-select"
                value={selectedRating}
                onChange={handleFilterRatingChange}
                aria-label="Default select example"
              >
                <option value="0" selected>Tất cả đánh giá</option>
                <option value="1">Đánh giá 1 sao</option>
                <option value="2">Đánh giá 2 sao</option>
                <option value="3">Đánh giá 3 sao</option>
                <option value="4">Đánh giá 4 sao</option>
                <option value="5">Đánh giá 5 sao</option>
              </select>
            </div>
          </div>
          {filteredReviews && filteredReviews.length > 0 ? (
            filteredReviews.map((comment, index) => { // comment: 1 đánh giá của combo (bởi 1 user)
              return (
                <div className="comment-container" key={index}>
                  <div className="avatar-username-star-container">
                    <div className="avatar">
                      {
                        comment && comment.dataUser && comment.dataUser.avatar ? (
                          <img src={'data:image/png;base64,' + comment.dataUser.avatar} alt="" />
                        ) : (
                          <img src={logoUser} alt="" />
                        )
                      }
                    </div>
                    <div className="username-star">
                      <span className="username-user">
                        {
                          // Xử lý trường hợp là bạn luôn => id user
                          comment?.userId && account && +comment.userId === +account.id ? "Bạn" : (
                            comment?.dataUser?.fullName ? comment.dataUser.fullName : 'Khách hàng'
                          )
                        }
                      </span>
                      <div className="star-container">
                        {[...Array(comment.rate)].map((_, i) => (
                          <img key={i} src={logoStar} alt="" />
                        ))}
                        {[...Array(5 - comment.rate)].map((_, i) => (
                          <img key={i + comment.rate} src={logoStarNobgColor} alt="" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="comment-content">
                    <p>{comment.comment}</p>
                  </div>
                  <div className="review-images-container">
                    {comment.imageRatings && Array.isArray(comment.imageRatings) && comment.imageRatings.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={'data:image/png;base64,' + image}
                        alt={`Review image ${imgIndex}`}
                        className="review-image"
                        onClick={() => handleImageClick('data:image/png;base64,' + image)} // Gọi modal preview
                      />
                    ))}
                  </div>
                  <p className="comment-date">{formatDate(comment.createdAt)}</p>
                </div>
              );
            })
          ) : (
            <div className='no-comment'>Không có đánh giá</div>
          )}
        </div>
        {/* Modal preview ảnh */}
        <ImagePreviewModal
          show={showImagePreview}
          image={previewImage}
          onClose={handleCloseImagePreview}
        />
      </div>
    </div>
  )
}

export default ComboItemDetail
