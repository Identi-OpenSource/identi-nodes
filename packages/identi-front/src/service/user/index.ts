// import apiSuite from '../apiSuite';
import apiClient from '../api';

function createUser(data: any) {
  return apiClient.post('/users', data);
}

/**
 * * Obtiene todos los Usuarios
 */
function paginateUsers(page: number, per_page: number, sort_by: string, order: string, search: string) {
  const router = `/users?page=${page}&per_page=${per_page}&sort_by=${sort_by}&order=${order}&search=${search}`;
  return apiClient.get(router);
}

function findOneUser(user_id: string) {
  return apiClient.get(`/users/${user_id}`);
}
function updateUser(user_id: string, data: any) {
  return apiClient.patch(`/users/${user_id}`, data);
}

function resentPassword(user_id: string) {
  return apiClient.post(`/users/${user_id}/resend_password`, {});
}

function getUserData() {
  return apiClient.get('/users/me');
}

function activeUser() {
  return apiClient.post('/users/active', {});
}

export { createUser, paginateUsers, findOneUser, updateUser, resentPassword, getUserData, activeUser };
