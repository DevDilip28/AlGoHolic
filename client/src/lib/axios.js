import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080/api/v1"
    : "https://algoholic-backend.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
