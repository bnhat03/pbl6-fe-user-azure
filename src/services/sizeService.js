import instance from "../setup/instanceAxios"; 

const fetchAllSizesService = () => {
    return instance({
        method: 'get',
        url: `/api/v1/public/sizes/all`,
    });
}

export {
    fetchAllSizesService,

}
