import { addToast } from "@heroui/react";
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response;

    switch (status) {
      case 201:
      case 204:
        addToast({
          title: "Success",
          description: error.response,
        });
        break;
      case 401:
        if (data?.code === "browser_agent") {
          window.location.reload();
        }
        // logout();
        return Promise.reject(error);
      default:
        if (data?.error) {
          return Promise.reject(data.error);
        }
        return Promise.reject(error);
    }
  }
);

export const setBrowserAgent = (fingerprint: string) => {
  api.interceptors.request.use((config) => {
    config.headers['Browser-Agent'] = fingerprint;
    return config;
  });
};

export const setBearerToken = (token: string) => {
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default api;
