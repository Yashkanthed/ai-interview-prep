import axiosClient from './axiosClient';

export const getAllUsersApi = (params) => axiosClient.get('/admin/users', { params });

export const getUserByIdApi = (userId) => axiosClient.get(`/admin/users/${userId}`);

export const updateUserRoleApi = (userId, payload) =>
  axiosClient.put(`/admin/users/${userId}/role`, payload);

export const deleteUserApi = (userId) => axiosClient.delete(`/admin/users/${userId}`);

export const getAllSessionsApi = (params) => axiosClient.get('/admin/sessions', { params });
