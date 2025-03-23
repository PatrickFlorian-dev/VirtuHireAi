import axios, { AxiosRequestConfig } from "axios";
import { IResponsePayload } from "../interfaces/payloads/responsePayload";
import { toast } from "react-toastify";

interface CustomAxiosConfig extends AxiosRequestConfig {
  showToast?: boolean; 
  successMessage?: string;
  errorMessage?: string;
}

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// SUCCESS INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => {
    const config = response.config as CustomAxiosConfig;
    const apiResponse: IResponsePayload<unknown> = response.data;

    if (apiResponse && apiResponse.success) {
      if (config?.showToast && config?.successMessage) {
        toast.success(config.successMessage);
      }
      response.data = apiResponse.data; // unwrap
      return response;
    } else {
      return Promise.reject(apiResponse);
    }
  },
  (error) => {
    const config = error.config as CustomAxiosConfig;
    const errResponse: IResponsePayload = error.response?.data || {
      statusCode: 500,
      success: false,
      message: error.message,
    };

    if (config?.showToast !== false) {
      // Default toast on error unless disabled
      toast.error(config?.errorMessage || errResponse.message || "Something went wrong");
    }

    console.error("❌ API Error Payload:", errResponse);
    return Promise.reject(errResponse);
  }
);

export default axiosClient;
