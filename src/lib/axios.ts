import config from "@/config";
// import axios, { type AxiosRequestConfig } from "axios";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
	baseURL: config.baseUrl,
	withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
	function (config) {
		// Do something before request is sent
		console.log("Axios", config);
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

let isRefreshing = false;

let pendingQueue: {
	resolve: (value: unknown) => void;
	reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown) => {
	pendingQueue.forEach((promise) => {
		if (error) {
			promise.reject(error);
		} else {
			promise.resolve(null);
		}
	});
	pendingQueue = [];
};

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError<{ message?: string }>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		// ✅ Fix 2: network error হলে response থাকে না
		if (!error.response || !originalRequest) {
			return Promise.reject(error);
		}

		// ✅ Fix 1: refresh-token request নিজে fail করলে আবার refresh করার চেষ্টা নয়
		const isRefreshRequest = originalRequest.url?.includes("/auth/refresh-token");

		const isTokenExpired =
			error.response.status === 500 && // backend 401 পাঠালে এখানে 401 লেখো
			error.response.data?.message === "jwt expired";

		if (isTokenExpired && !originalRequest._retry && !isRefreshRequest) {
			originalRequest._retry = true;

			// অন্য request আগেই refresh শুরু করে থাকলে queue-তে অপেক্ষা করো
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					pendingQueue.push({ resolve, reject });
				}).then(() => axiosInstance(originalRequest));
			}

			isRefreshing = true;

			try {
				await axiosInstance.post("/auth/refresh-token");
				processQueue(null);
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError);

				// ✅ Fix 3: refresh token-ও expired → logout
				// যেমন: store.dispatch(logout()); window.location.href = "/login";

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
