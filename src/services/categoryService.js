import instance from "../setup/instanceAxios"; // an instance of axios

const fetchAllCategoriesService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/categories/all`,
    });
}

export {
    fetchAllCategoriesService,

}
