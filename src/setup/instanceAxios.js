import axios from "axios";

const instance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    // withCredentials: true, // Gửi cookie khi request
});

// Thêm interceptor cho request => Mỗi khi gửi request, interceptor này sẽ tự động thêm Authorization header
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token"); // Lấy token mới mỗi lần gọi API
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm token vào headers
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


let isRefreshing = false; // Biến theo dõi nếu đang refresh token => Refresh token đã được bắt đầu bởi một request khác => Tránh gửi nhiều request refresh token cùng lúc.
let failedQueue = []; // Danh sách các request bị treo trong quá trình refresh
// Xử lý các request bị chờ trong lúc refresh token.
const processQueue = (error, token) => {
    failedQueue.forEach(prom => {
        if (error) { //  refresh thất bại -> Reject các request trong queue.
            prom.reject(error);
        } else { // refresh thành công -> Gọi lại các request bị chờ với token mới.
            prom.resolve(token); 
        }
    });
    failedQueue = [];
};
// Interceptor cho response => Xử lý lỗi 401 Unauthorized
// 1. Tự động refresh token khi token hết hạn và retry lại request ban đầu
// 2. Tránh loop vô hạn hoặc xử lý đồng thời nhiều lần refresh token.
instance.interceptors.response.use(function (response) { // status code: 2xx
    return response;
}, async function (error) { // status code: 4xx, 5xx
    const originalRequest = error.config; // config của request gốc gây ra lỗi -> Dùng để retry request sau khi refresh token thành công.

    // Kiểm tra nếu lỗi là 401 (Unauthorized) và chưa được retry
    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu request đã retry để tránh loop vô hạn trong trường hợp refresh token thất bại.
        // Đang trong quá trình refresh
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            // Chờ đến khi nào processQueue chạy
            .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
                // instance(originalRequest): Gửi lại request ban đầu => return Promise
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }
        // Bắt đầu refresh token (request đầu tiên bắt đầu)
        isRefreshing = true;
        const refreshToken = localStorage.getItem("token"); // Lấy refresh token từ localStorage 

        try {
            let urlBE = import.meta.env.VITE_BACKEND_URL || `http://localhost:8080`;
            const response = await axios.post(`${urlBE}/auth/refresh`, { refreshToken });
            const newToken = response?.data?.data ? response.data.data : refreshToken; // Lấy token mới từ response -> note: Lỗi thì giữ nguyên token cũ ko refresh
            localStorage.setItem("token", newToken); // Lưu token mới vào localStorage
            processQueue(null, newToken); // Xử lý lại các request trong queue => Các request này được retry với token mới.
            originalRequest.headers.Authorization = `Bearer ${newToken}`; // Cập nhật token cho request ban đầu
            return instance(originalRequest); // Retry lại request ban đầu với token mới
        } catch (refreshError) {
            // Nếu refresh token thất bại, xóa thông tin authentication
            localStorage.removeItem("token");
            // localStorage.removeItem("refreshToken");
            processQueue(refreshError, null); // Xử lý các request trong queue với lỗi refresh
            return Promise.reject(refreshError); // Trả về lỗi nếu refresh token thất bại
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error); // Trả về lỗi nếu không phải lỗi 401
});

export default instance;
