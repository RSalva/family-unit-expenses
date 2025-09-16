import http from './api-service'

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