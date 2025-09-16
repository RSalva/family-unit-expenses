import axios from 'axios';
import { LS_USER } from '../contexts/auth';

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

// Refactor to use with units
// Depending on the error received, redirect to the page needed
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

// getUnits
// getUnitById
// createUnit
// updateUnit
// deleteUnit
// add UserToUnit
// removeUserFromUnit

export const createUnit = (unit) => {
  return http.post('/users/me/units', unit);
};

export const getUnits = () => {
  return http.get('/users/me/units');
};

export const getUnitById = (id) => {
  return http.get(`/users/me/units/${id}`);
};

export const updateUnit = (id, unit) => {
  return http.patch(`/users/me/units/${id}`, unit);
};

export const deleteUnit = (id) => {
  return http.delete(`/users/me/units/${id}`);
};

export const addUserToUnit = (unitId, user) => {
  return http.post(`/users/me/units/${unitId}/users/`, user);
};

export const removeUserFromUnit = (unitId, userId) => {
  return http.delete(`/users/me/units/${unitId}/users/${userId}`);
};