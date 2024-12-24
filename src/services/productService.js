import instance from "../setup/instanceAxios"; 

const fetchProductsBestSaleService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/best-sale`,
    });
}
const fetchProductsByIdCategoryService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/category/${id}`,
    });
}
const fetchAllCombosService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/combo/all`,
    });
}
const fetchAllDrinksService = (drinkId) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/category/${drinkId}`,
    });
}

const fetchProductByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/${id}`,
    });
}
const fetchComboByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/combo/${id}`,
    });
}
const fetchProductsByIdStoreService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/store/${id}`,
    });
}
const fetchRatingProductByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/rate/product/${id}`,
    });
}
const fetchRatingComboByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/rate/combo/${id}`,
    });
}

// Tất cả sp -> Page: All Products
const fetchAllProductsService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/products/all`,
    });
}

export {
    fetchProductsBestSaleService,
    fetchProductsByIdCategoryService,
    fetchAllCombosService,
    fetchAllDrinksService,
    fetchProductByIdService,
    fetchComboByIdService,
    fetchProductsByIdStoreService,
    fetchRatingProductByIdService,
    fetchRatingComboByIdService,
    fetchAllProductsService,
}
