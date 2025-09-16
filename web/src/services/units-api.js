import http from './api-service';

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