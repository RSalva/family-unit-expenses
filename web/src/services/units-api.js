import http from './api-service';

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
  console.log("Users add object in units-api", users)
  return http.post(`/users/me/units/${unitId}/users`, users);
};

export const removeUserFromUnit = (unitId, userId) => {
  return http.delete(`/users/me/units/${unitId}/users/${userId}`);
};

export const removeUsersFromUnit = (unitId, users) => {
  console.log("Users delete object in units-api", users)
  return http.post(`/users/me/units/${unitId}/users/delete`, users);
}

export const updateUnitUsers = (unitId, users) => {
  return http.patch(`/users/me/units/${unitId}/users`, users);
}