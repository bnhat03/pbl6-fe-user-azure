import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPromotionById } from '../../redux/actions/promotionActions';
import './PromotionDetail.scss';  // Import SCSS file

const PromotionDetail = () => {
    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        // Lấy các thông tin cần thiết
        const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const dayOfWeek = daysOfWeek[date.getDay()];

        const day = date.getDate();  // Lấy ngày
        const month = date.getMonth() + 1;  // Lấy tháng (tháng trong JS bắt đầu từ 0)
        const year = date.getFullYear();  // Lấy năm

        const hours = date.getHours().toString().padStart(2, '0');  // Lấy giờ (padStart để đảm bảo đủ 2 chữ số)
        const minutes = date.getMinutes().toString().padStart(2, '0');  // Lấy phút

        // Tạo chuỗi thời gian theo định dạng "Thứ ngày tháng + giờ"
        // return `${dayOfWeek} ngày ${day}/${month}/${year}, ${hours}:${minutes}`;
        return `${hours}:${minutes} ngày ${day}/${month}/${year}`;
    };

    // API
    const { id } = useParams();
    const dispatch = useDispatch();
    const promotion = useSelector((state) => {
        return state.promotion.promotionDetail;
    })
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(fetchPromotionById(id));
    }, [id]);

    if (!promotion) {
        return (
            <div className="promotion-detail-page">
                <h1>KHÔNG CÓ THÔNG TIN KHUYẾN MÃI</h1>
            </div>
        );
    }
    else return (
        <div className="promotion-detail-page">
            <h1>{promotion.name}</h1>
            <div className="infor-container">
                <p>- Mô tả: {promotion.description}</p>
                <p>- Thời gian: </p>
                <ul>
                    <li>Bắt đầu: {formatDate(promotion.startDate)}</li>
                    <li>Kết thúc: {formatDate(promotion.endDate)}</li>
                </ul>
                {/* Note: Trả về storeName không phải storeId */}
                <p>- Áp dụng tại các cửa hàng: </p>
                <ul>
                    {
                        promotion.storeNames && promotion.storeNames.length > 0 && promotion.storeNames.map((store, index) => (
                            <li key={index}>{store}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

export default PromotionDetail;
