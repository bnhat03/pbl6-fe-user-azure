import React, { useState, useEffect } from 'react'
import './ProductItemDetail.scss'
import logoStar from '../../assets/logo/star.png'
import logoStarNobgColor from '../../assets/logo/star_no_bgcolor.png'
import logoUser from '../../assets/logo/user.png'
import StoreList from '../StoreList/StoreList';
import ProductItemModal from '../ProductItemModal/ProductItemModal';
import ImagePreviewModal from '../ImagePreviewModal/ImagePreviewModal'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchRatingProductById, fetchSimilarProducts } from "../../redux/actions/productActions";
import FoodDisplay from '../FoodDisplay/FoodDisplay'

const ProductItemDetail = () => {
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
  // Modal Product
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const handleShowModalProduct = () => {
    setShowModalProduct(true); // Hiển thị modal
  };
  const handleCloseModalProduct = () => {
    setShowModalProduct(false); // Đóng modal
    setTimeout(() => {
      setIsAddToCart(false);
    }, 200);
  };
  const handleAddToCartClick = () => {
    setIsAddToCart(true);
    handleShowModalProduct();
  };

  const { id } = useParams();
  const dispatch = useDispatch();
  // state redux
  const productDetail = useSelector((state) => {
    return state.product.productDetail;
  })
  const listSimilarProducts = useSelector((state) => {
    return state.product.listSimilarProducts;
  })
  const isLoading = useSelector((state) => state.product.isLoadingListSimilarProducts);
  const ratingProduct = useSelector((state) => { // All bài đánh giá sản phẩm (Ko phải số sao)
    return state.product.ratingProduct;
  })
  const account = useSelector((state) => state.auth.account); // Khách hàng đã đánh giá sản phẩm ni -> Vô coi đánh giá sản phẩm -> hiện "Bạn"
  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchRatingProductById(id));
    dispatch(fetchSimilarProducts(id));
    window.scrollTo(0, 0);
  }, [id]);

  // Select -> Lọc số sao ở review
  const [selectedRating, setSelectedRating] = useState("0"); // Lọc số sao sản phẩm, Mặc định là "Tất cả đánh giá"
  const filteredReviews = Array.isArray(ratingProduct) ? ratingProduct.filter(review =>
    selectedRating === "0" || +review.rate === +selectedRating
  ) : [];
  const handleFilterRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  if (!productDetail) {
    return <div>Không có thông tin sản phẩm.</div>;
  }
  else return (
    <div className="page-product-detail">
      <div className="container">
        <div className="product-detail-infor">
          <div className="infor-left">
            <div className="infor-left-img-container">
              <img src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${productDetail.image}`} alt="" />
            </div>
          </div>
          <div className="infor-right">
            <div className="infor-right-category">
              <span>{productDetail?.category?.categoryName || 'Danh mục không xác định'}</span>
            </div>

            <div className="infor-right-name">{productDetail.productName}</div>
            <div className="infor-right-review">
              <span>
                {productDetail?.averageRate ? +productDetail.averageRate.toFixed(1) : "0"} / 5
                <img src={logoStar} alt="" />
              </span>
              <span>({ratingProduct.length} đánh giá)</span>
            </div>
            <hr />
            <div className="infor-right-price-container">
              <span className="infor-right-price-discount">
                {Number(productDetail.discountedPrice).toLocaleString('vi-VN')} đ
              </span>
              <span className="infor-right-price-origin">
                {Number(productDetail.price).toLocaleString('vi-VN')} đ
              </span>
            </div>
            <div className="infor-right-description">
              <span>&#128073; Mô tả: {productDetail.description}</span>
            </div>
            <hr />
            <div className="infor-right-btn-container">
              <button
                className='btn-buynow'
                onClick={handleShowModalProduct}
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
                <span>&#128073;  Danh sách cửa hàng hiện có</span>
              </div>
              <StoreList stores={productDetail.stores} />
            </div>
            <ProductItemModal
              showModalProduct={showModalProduct}
              handleCloseModalProduct={handleCloseModalProduct}
              product={productDetail}
              stores={productDetail.stores}
              isAddToCart={isAddToCart}
            />
          </div>
        </div>

        <div className="similar-products-container">
          <h2>SẢN PHẨM CÙNG DANH MỤC</h2>
          <FoodDisplay listProducts={listSimilarProducts} isLoading={isLoading} />
        </div>
        <div className="product-detail-comment">
          <h2>Bài viết đánh giá</h2>
          <div class="filter-wrapper">
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
            filteredReviews.map((comment, index) => { // comment: 1 đánh giá của sp (bởi 1 user)
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
                    {/* {comment.imageRatings && Array.isArray(comment.imageRatings) && comment.imageRatings.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={'data:image/png;base64,' + image}
                        alt={`Review image ${imgIndex}`}
                        className="review-image" />
                    ))} */}
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
          show={showImagePreview} // boolean
          image={previewImage}
          onClose={handleCloseImagePreview}
        />
      </div>
    </div>
  )
}

export default ProductItemDetail
