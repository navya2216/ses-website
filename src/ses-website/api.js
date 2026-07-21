import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://192.168.88.2:4007",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
