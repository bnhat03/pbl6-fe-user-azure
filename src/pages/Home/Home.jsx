import React, { useState, useEffect } from "react";
import "./Home.scss";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import Service from "../../components/Service/Service";
import BannerWelcome from "../../components/BannerWelcome/BannerWelcome";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBestSale } from "../../redux/actions/productActions";
import { fetchFavouriteProducs } from "../../redux/actions/userActions";

const Home = () => {
  const dispatch = useDispatch();
  const listProductsBestSale = useSelector((state) => {
    return state.product.listProductsBestSale;
  });
  const isLoadingListProductsBestSale = useSelector((state) => {
    return state.product.isLoadingListProductsBestSale;
  });
  const isLoadingListFavouriteProducts = useSelector((state) => {
    return state.user.isLoadingListFavouriteProducts;
  });
  const isAuthenticated = useSelector((state) => {
    return state.auth.isAuthenticated;
  });
  const account = useSelector((state) => {
    return state.auth.account;
  });
  const listFavouriteProducts = useSelector((state) => {
    return state.user.listFavouriteProducts;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavouriteProducs(account.id));
    }
  }, [account, dispatch]);

  return (
    <div className="page-homepage">
      <Header />
      <ExploreMenu />
      <h2 className="best-sale">SẢN PHẨM BÁN CHẠY</h2>
      <FoodDisplay
        listProducts={listProductsBestSale}
        isLoading={isLoadingListProductsBestSale}
      />
      {/* {
        isAuthenticated && (
          <>
            <h2 className="favourite">CÓ THỂ BẠN QUAN TÂM</h2>
            {
              listFavouriteProducts && (
                <FoodDisplay listProducts={listFavouriteProducts} isLoading={isLoadingListFavouriteProducts} />
              )
            }
          </>
        )
      } */}
      <BannerWelcome />
      <Service />
    </div>
  );
};

export default Home;
