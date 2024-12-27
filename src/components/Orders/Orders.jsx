import React, { useState, useEffect } from "react";
import './Orders.scss';
import OrderDetailModal from '../../components/OrderDetailModal/OrderDetailModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, cancelOrder } from "../../redux/actions/userActions";
import ReviewModal from "../ReviewModal/ReviewModal";
import Pagination from 'react-bootstrap/Pagination';
import { Link, NavLink } from "react-router-dom";
// const _ = require('lodash'); // copy object

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => {
    return state.user.allOrders || [];
  })
  const [showModalViewDetail, setShowModalViewDetail] = useState(false);
  const [showModalReviewOrder, setShowModalReviewOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [statusOrderInteger, setStatusOrderInteger] = useState(0);
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  // Dropdown
  const [selectedStatus, setSelectedStatus] = useState("0"); // Mặc định là "Tất cả đơn hàng"

  // Nhấn vô 'Xem chi tiết đơn hàng' -> Quy trạng thái từ Chữ => Số
  const handleShowDetails = (order) => {
    switch (order.status) {
      case 'Đơn hàng mới':
        setStatusOrderInteger(1);
        break;
      case 'Đơn hàng đã bị hủy':
        setStatusOrderInteger(2);
        break;
      case 'Đơn hàng đã được xác nhận': case 'Đơn hàng đã chọn được người giao': case 'Đơn hàng đã được người giao nhận':
        setStatusOrderInteger(3);
        break;
      case 'Đơn hàng đang giao':
        setStatusOrderInteger(4);
        break;
      case 'Đơn hàng đã hoàn thành':
        setStatusOrderInteger(5);
        break;
      default:
        setStatusOrderInteger(1);
    }
    setOrderDetails(order);
    setShowModalViewDetail(true);
  };
  const handleShowReviewOrder = (order) => {
    setOrderDetails(order);
    setShowModalReviewOrder(true);
  };

  const handleCloseViewDetail = () => {
    setShowModalViewDetail(false);
    // setOrderDetails(null); // Reset thông tin đơn hàng
  };
  const handleCloseReviewOrder = () => {
    setShowModalReviewOrder(false);
  };

  // Format Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();  
    const month = date.getMonth() + 1;  
    const year = date.getFullYear();  
    const hours = date.getHours().toString().padStart(2, '0');  // Lấy giờ (padStart để đảm bảo đủ 2 chữ số)
    const minutes = date.getMinutes().toString().padStart(2, '0');  
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
  };
  const handleCancelOrder = (orderCode) => {
    dispatch(cancelOrder(orderCode));
  }

  // Lọc đơn hàng theo selectedStatus
  const filteredOrders = Array.isArray(orders) ? orders.filter(order =>
    selectedStatus === "0" || order.status === selectedStatus // chữ
  ) : [];

  // Phân trang
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = Array.isArray(filteredOrders) ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder) : []; 
  const totalPages = Math.ceil((Array.isArray(filteredOrders) ? filteredOrders.length : 0) / itemsPerPage);

  // Chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setCurrentPage(1); 
  };
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="orders-management">
      <div className="container">
        <div className="icon-filter-container">
          <div className="icon-container">
            <i className="icon-i fa-solid fa-box-open"></i>
            <span className='icon-span'>các đơn hàng của bạn</span>
          </div>
          <div className="filter-container">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={handleStatusChange}
              aria-label="Default select example"
            >
              <option value="0" selected>Tất cả đơn hàng</option>
              <option value="Đơn hàng mới">Đơn hàng mới</option>
              <option value="Đơn hàng đã bị hủy">Đơn hàng đã bị hủy</option>
              <option value="Đơn hàng đã được xác nhận">Đơn hàng đã được xác nhận</option>
              <option value="Đơn hàng đang giao">Đơn hàng đang giao</option>
              <option value="Đơn hàng đã hoàn thành">Đơn hàng đã hoàn thành</option>
            </select>
          </div>
        </div>
        <table className="table table-striped table-orders table-bordered">
          <thead>
            <tr>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Xem chi tiết đơn hàng</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {
              currentOrders && currentOrders.length > 0 ? (currentOrders.map((order, index) => (
                <tr key={index}>
                  <td scope="row" className="text-center align-middle">{order.orderCode}</td>
                  <td className="text-center align-middle">{formatDate(order.orderDate)}</td>
                  <td className="text-center align-middle">{Number(order.totalAmount).toLocaleString('vi-VN')} đ</td>
                  <td className="text-center align-middle">{order.status}</td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowDetails(order)}
                    >
                      Xem chi tiết
                    </button>
                  </td>

                  {/* status = 7 -> Hiện button 'Đánh giá' */}
                  {/* status = 6 -> Hiện button 'Xem lộ trình' */}
                  {/* status = 1 -> Hiện button 'Hủy đơn hàng */}
                  {/* status = 2,3,4,5 -> Disable button 'Hủy đơn hàng' */}
                  {
                    order && order.status == 'Đơn hàng đã hoàn thành' && (
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-success"
                          onClick={() => handleShowReviewOrder(order)}
                          disabled={order.feedBack === true ? true : false}
                        >
                          Đánh giá
                        </button>
                      </td>)
                  }
                  {
                    order && order.status == 'Đơn hàng đang giao' && (
                      <td className="text-center align-middle">
                        <Link to={`/order-in-transit/${order.orderCode}`}>
                          <button
                            className="btn btn-info"
                          >
                            Xem lộ trình
                          </button>
                        </Link>
                      </td>)
                  }
                  {
                    order && order.status !== 'Đơn hàng đã hoàn thành' && order.status !== 'Đơn hàng đang giao' && (
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-warning"
                          disabled={order.status === 'Đơn hàng mới' ? false : true}
                          onClick={() => handleCancelOrder(order.orderCode)}
                        >
                          Hủy đơn hàng
                        </button>
                      </td>
                    )
                  }
                </tr>
              )))
                : (
                  <tr >
                    <td colSpan={6}>Không có đơn hàng nào</td>
                  </tr>
                )
            }
          </tbody>
        </table>
        <NavLink
          to="/"
          end
        >
          <button className="btn btn-dark btn-return-homepage">TRỞ LẠI TRANG CHỦ</button>
        </NavLink>
        {/* Phân trang */}
        <div className="pagination-container">
          <Pagination>
            <Pagination.Prev onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
        <OrderDetailModal
          showModal={showModalViewDetail}
          handleClose={handleCloseViewDetail}
          orderDetails={orderDetails}
          statusOrderInteger={statusOrderInteger}
        />
        <ReviewModal
          showModal={showModalReviewOrder}
          handleClose={handleCloseReviewOrder}
          orderDetails={orderDetails}
        />
      </div>
    </div>
  );
};

export default Orders;
