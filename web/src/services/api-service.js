import axios from 'axios';
import { LS_USER } from '../contexts/auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (
      error.response?.status === 401 &&
      location.pathname !== '/login'
    ) {
      localStorage.clear(LS_USER);
      location.replace('/login');
    } else if (error.response?.status === 403) {
      location.replace('/forbidden');
    } else {
      return Promise.reject(error);
    }
  }
);

export default http;