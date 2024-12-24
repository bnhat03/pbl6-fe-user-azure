import instance from "../setup/instanceAxios"; 

const fetchAllStoresService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/stores/all`,
    });
}
const fetchStoreByIdService = (id) => {
    return instance({
        method: 'get',
        url: `/api/v1/public/stores/${id}`,
    });
}

export {
    fetchAllStoresService,
    fetchStoreByIdService,

}
