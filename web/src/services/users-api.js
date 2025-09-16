import axios from 'axios';
import { LS_USER } from '../contexts/auth';

const http = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});

http.interceptors.request.use(
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

export const register = (user) => {
  return http.post('/users', user);
}

export const login = (user) => {
  return http.post('/sessions', user);
};

export const logout = () => {
  return http.delete('/sessions/me');
}

export const listUsers = () => {
  return http.get('/users');
};

export const deleteUser = (id) => {
  return http.delete(`/users/${id}`);
};