import axiosClient from './axiosClient';

export const registerApi       = (payload) => axiosClient.post('/auth/register', payload);
export const verifyOtpApi      = (payload) => axiosClient.post('/auth/verify-otp', payload);
export const resendOtpApi      = (payload) => axiosClient.post('/auth/resend-otp', payload);
export const loginApi          = (payload) => axiosClient.post('/auth/login', payload);
export const logoutApi         = ()        => axiosClient.post('/auth/logout');
export const refreshApi        = ()        => axiosClient.post('/auth/refresh');
export const getProfileApi     = ()        => axiosClient.get('/users/me');
export const updateProfileApi  = (payload) => axiosClient.put('/users/me', payload);
export const forgotPasswordApi = (payload) => axiosClient.post('/auth/forgot-password', payload);
export const verifyResetOtpApi = (payload) => axiosClient.post('/auth/verify-reset-otp', payload);
export const resetPasswordApi  = (payload) => axiosClient.post('/auth/reset-password', payload);