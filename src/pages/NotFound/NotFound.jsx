import React, { useState, useEffect } from 'react';
import './NotFound.scss'
import { NavLink } from 'react-router-dom';

const NotFound = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <div className="not-found-page">
            <div className="container">
                <div className="paragraph-not-found">
                    <p>Không tìm thấy trang web</p>
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

export default NotFound;