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

export const addUsersToUnit = (unitId, users) => {
  return http.post(`/users/me/units/${unitId}/users/`, users);
};

export const removeUserFromUnit = (unitId, userId) => {
  return http.delete(`/users/me/units/${unitId}/users/${userId}`);
};

/*updateUnitUsers = (unitId, users) => {
  return http.patch(`/users/me/units/${unitId}/users`, users);
}*/