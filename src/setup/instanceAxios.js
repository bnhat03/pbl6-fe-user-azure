import axios from "axios";

const instance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    // withCredentials: true, // Gửi cookie khi request
});

// Thêm interceptor cho request 
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm token vào headers
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

let isRefreshing = false; // Tránh gửi nhiều request refresh token cùng lúc.
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
instance.interceptors.response.use(function (response) { // status code: 2xx
    return response;
}, async function (error) { // status code: 4xx, 5xx
    const originalRequest = error.config; // Retry request sau khi refresh token thành công.
    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
            // Chờ đến khi nào processQueue chạy
            .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            })
            .catch(err => {
                return Promise.reject(err);
            });
        }
        // Bắt đầu refresh token (request đầu tiên bắt đầu)
        isRefreshing = true;
        const refreshToken = localStorage.getItem("token"); 
        try {
            let urlBE = import.meta.env.VITE_BACKEND_URL || `http://localhost:8080`;
            const response = await axios.post(`${urlBE}/auth/refresh`, { refreshToken });
            const newToken = response?.data?.data ? response.data.data : refreshToken; 
            localStorage.setItem("token", newToken); 
            processQueue(null, newToken); // Các request được retry với token mới.
            originalRequest.headers.Authorization = `Bearer ${newToken}`; 
            return instance(originalRequest); // Retry request ban đầu 
        } catch (refreshError) {
            // Xóa thông tin authentication
            localStorage.removeItem("token");
            // localStorage.removeItem("refreshToken");
            processQueue(refreshError, null); // Xử lý các request trong queue với lỗi refresh
            return Promise.reject(refreshError); 
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error); // Trả về lỗi nếu không phải lỗi 401
});

export default instance;
