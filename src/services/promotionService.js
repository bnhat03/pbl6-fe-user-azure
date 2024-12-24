import instance from "../setup/instanceAxios";

const fetchAllPromotionsService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/promotions/all`,
    });
}
const fetchPromotionByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/promotions/${id}`,
    });
}
const fetchVouchersByIdStoreService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/voucher/${id}`,
    });
}

export {
    fetchAllPromotionsService,
    fetchPromotionByIdService,
    fetchVouchersByIdStoreService,

}
