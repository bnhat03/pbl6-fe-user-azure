import React, { useState, useEffect } from "react";
import './ExploreMenu.scss'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from "../../redux/actions/categoryActions";
import { NavLink } from "react-router-dom";
import cate_1 from "../../assets/navbar/cate_1.png";

const ExploreMenu = () => {
  // fetch category
  const listCategories = useSelector((state) => {
    return state.category.listCategories;
  })
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Ăn gì hôm nay</h1>
      <p className='explore-menu-text'>Thực đơn đa dạng và phong phú, có rất nhiều sự lựa chọn cho bạn, gia đình và bạn bè.</p>
      <div className="explore-menu-list">
        <NavLink to={`/combo`} >
          <div className='explore-menu-list-item'>
            <img className='active'
              src={cate_1}
              alt="Ảnh combo"
            />
            <p>Combo</p>
          </div>
        </NavLink>
        {listCategories && listCategories.length > 0
          &&
          listCategories.map((category, index) => {
            return (
              <NavLink to={`/category/${category.categoryId}`} key={index}>
                <div key={index} className='explore-menu-list-item'>
                  <img className='active' src={`${import.meta.env.VITE_BACKEND_URL}/api/v1/public/uploads/images/${category.image}`} alt="alt-category" />
                  <p>{category.categoryName}</p>
                </div>
              </NavLink>
            )
          })}
      </div>
      <hr />
    </div>
  )
}
export default ExploreMenu
