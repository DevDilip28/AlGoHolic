import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/v1"
    : `${import.meta.env.VITE_API_URL}/api/v1`;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
