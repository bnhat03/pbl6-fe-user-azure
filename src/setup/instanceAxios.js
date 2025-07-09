import axios from "axios";

const instance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
});

// interceptors request
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

let isRefreshing = false; 
let failedQueue = []; 
// Xử lý các request bị chờ trong lúc refresh token.
const processQueue = (error, token) => {
    failedQueue.forEach(prom => {
        if (error) { 
            prom.reject(error);
        } else { 
            prom.resolve(token); 
        }
    });
    failedQueue = [];
};
// Interceptor cho response => Xử lý lỗi 401 Unauthorized
instance.interceptors.response.use(function (response) { 
    return response;
}, async function (error) { 
    const originalRequest = error.config; 
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
        // Bắt đầu refresh token 
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
            localStorage.removeItem("token");
            processQueue(refreshError, null); 
            return Promise.reject(refreshError); 
        } finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error); // !401
});

export default instance;
