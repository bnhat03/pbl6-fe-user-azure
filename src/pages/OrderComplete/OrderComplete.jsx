import React, { useState, useEffect } from 'react';
import './OrderComplete.scss'
import { NavLink } from 'react-router-dom';

const OrderComplete = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="order-complete-page">
            <div className="container">
                <div className="paragraph-complete">
                    <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Đơn hàng sẽ sớm được giao</p>
                    <NavLink
                        to="/"
                        end
                    >
                        <button>Về trang chủ</button>
                    </NavLink>
                </div>

            </div>
        </div>
    )
}

export default OrderComplete;